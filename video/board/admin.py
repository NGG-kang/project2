from django.contrib import admin
from .models import Post, Comment, Video, VideoGroup
from django.utils.safestring import mark_safe


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    # if "thumb_nail_tag":
    #     list_display = ["title", "thumb_nail_tag", "video_tag"]
    #     list_display_links = ["title", "thumb_nail_tag"]
    # else:

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.select_related("video__post_video", "video__author", "author")\
        .prefetch_related("post_group")
        return queryset

    list_display = ["id", "author", "title", "video_tag", "description", "views_count", "public_status", "display_post_group"]
    list_display_links = ["id", "title"]
    actions = ['status_to_public']
    list_filter = ["author", "post_group"]

    def thumb_nail_tag(self, post):
        return mark_safe(f"<img src={post.thumb_nail.url} style='width: 100px;' />")

    def video_tag(self, post):
        return mark_safe(f"<video controls width='250'><source src='{post.video}' type='video/webm'</video>")

    def status_to_public(self, request, queryset):
        update_status_counts = queryset.update(public_status=1)
        self.message_user(request, '{}건의 포스팅을 Public 상태로 변경'.format(update_status_counts))

    status_to_public.short_description = '지정 포스팅을 Public 상태로 변경'








@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ["author", "video_tag", 'video_name', 'video_size']

    def video_tag(self, video):
        return mark_safe(f"<video controls width='250'><source src='{video.video.url}' type='video/webm'</video>")

    def video_name(self, video):
        return video.video_name()

    def video_size(self, video):
        # size는 byte크기로 반환한다.
        return video.video.size



@admin.register(VideoGroup)
class VideoGroupAdmin(admin.ModelAdmin):
    list_display = ['id', 'author', 'group_name', 'public_status']
    list_display_links = ['id', 'author', 'group_name']