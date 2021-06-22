import logging
import os
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator
from django.db.models.signals import post_save
from django.dispatch import receiver

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

logger = logging.getLogger('django')


# created, updated 시간 모델, 상속전용
class TimeModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# Video를 먼저 업로드 하고 Post를 수정하기 위해 따로 분리
class Video(models.Model):
    author = models.ForeignKey(get_user_model(), on_delete=models.RESTRICT, related_name='video_author')
    video = models.FileField(upload_to='board/post/%Y/%m/%d/', validators=[
        FileExtensionValidator(allowed_extensions=['avi', 'mp4', 'mkv', 'mpeg', 'webm'])])

    def __str__(self):
        return os.path.basename(self.video.name).split(".")[0]

    # 저장되는 파일 이름 추출
    def video_name(self):
        return os.path.basename(self.video.name).split(".")[0]

    class Meta:
        ordering = ['author']


# Video Upload 및 세이브 후 자동으로 Post object 생성
@receiver(post_save, sender=Video)
def create_Post(sender, instance, created, **kwargs):
    name = os.path.basename(instance.video.name).split(".")[0]

    if created:
        if not hasattr(instance, 'Post'):
            Post.objects.create(video=instance, title=name, author=instance.author)


# 0으로 하면 빠꾸먹이는 validate
def validate_public_status(status):
    if status == 0:
        raise ValidationError(
            _('공개 여부를 설정해야 합니다.'),
            params={'status', status},
        )


class PublicStatus(models.TextChoices):
    NOTHING = 0  # 초안, 디폴트값, 아무것도 안 함, 0으로 설정되면 안됨
    PUBLIC = 1  # 전부 공개
    PRIVATE = 2  # 비공개
    PARTIAL = 3  # 일부 공개 (Detail URL 있으면 볼 수 있음)


class Post(TimeModel):
    author = models.ForeignKey(get_user_model(), on_delete=models.RESTRICT, related_name='post_author')
    post_group = models.ManyToManyField("VideoGroup", blank=True)
    video = models.OneToOneField(Video, on_delete=models.CASCADE, related_name="post_video")
    title = models.CharField(max_length=100)
    thumb_nail = models.ImageField(upload_to='board/post/%Y/%m/%d/', validators=[FileExtensionValidator(allowed_extensions=['png', 'jpg', 'jpeg'])])
    description = models.TextField(max_length=5000, help_text="시청자에게 동영상에 대해 알려주세요", blank=True)
    # TODO: 조회수 유저가 영상 시작을 누르고 영상 30초 이상 지나야 올라가게 구현할까?
    views_count = models.PositiveBigIntegerField(default=0)
    public_status = models.CharField(max_length=1, choices=PublicStatus.choices, default=0, validators=[validate_public_status])

    # Video랑 연결되어 있어서 Ordering 여기서 못함
    # class Meta:
    #     ordering = ['-id']

    def __str__(self):
        return self.video.video.name

    # ManyToMany값 Admin에서 보여주는 함수, 그러나 쿼리 너무 많이 먹는다고 사용 비추천이라고 함
    def display_post_group(self):
        return ', '.join(group.group_name for group in self.post_group.all())


class Comment(TimeModel):
    author = models.ForeignKey(get_user_model(), on_delete=models.RESTRICT)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    message = models.TextField(max_length=300)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.message


# 영상 그룹 모델, 유저별 비디오 그룹 나누기 위해
class VideoGroup(models.Model):
    # 유저별로 비디오 그룹
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    group_name = models.TextField(max_length=150, help_text="재생목록 제목")
    public_status = models.CharField(max_length=1, choices=PublicStatus.choices, default=0,
                                     validators=[validate_public_status])

    def __str__(self):
        return self.group_name
