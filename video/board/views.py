from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework import pagination
from rest_framework.decorators import api_view, action
from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet

from .models import Post, Comment, VideoGroup, Video
from .serializer import PostSerializer, CommentSerializer, VideoSerializer, VideoGroupSerializer
from django.db import IntegrityError
from asgiref.sync import sync_to_async
import logging


# TODO: 각 쿼리셋마다 select_related가 붙는데 하나로 통일할 방법이 있나 확인해야할듯
# video 뷰 / URL: video/
class VideoModelViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().select_related("author")
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['-id']

    def create(self, request, *args, **kwargs):
        data = {"video": request.data['file']}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        obj = serializer.save(author=self.request.user)
        return super().perform_create(serializer)


# video-group 뷰 / URL: video-group/
class VideoGroupModelViewSet(viewsets.ModelViewSet):
    queryset = VideoGroup.objects.all().select_related("author")
    serializer_class = VideoGroupSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['author']


# 일반 post view / post create, delete, retrieve 사용중 / URL: post/
# 여기 list view는 public_status 상관없이 전부 보여준다.
class PostModelViewSet(viewsets.ModelViewSet):
    queryset = (
        Post.objects.all()
            .select_related("video__post_video", "video__author", "author")\
            .prefetch_related("post_group")
    )
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['id']


    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        return super().perform_create(serializer)

    def retrieve(self, request, *args, **kwargs):
        self.get_queryset().filter(Q(public_status=1) | Q(public_status=3))
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


# 메인화면 무한 스크롤 전용 PostListView / URL: post_infinity_scroll
class PostScrollView(ListModelMixin, GenericViewSet):
    queryset = Post.objects.all()\
        .select_related("video__post_video", "video__author", "author")\
        .prefetch_related("post_group")
    serializer_class = PostSerializer
    ordering = ['id']
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        next = request.GET.get('items')
        if not next:
            next=20

        if int(next) > Post.objects.all().count():
            queryset = self.filter_queryset(self.get_queryset()).filter(public_status=1).order_by('-created_at')[:int(next)]
            serializer = self.get_serializer(queryset, many=True)
            return Response({
            "post": serializer.data,
            "has_more": False,
            })

        queryset = self.filter_queryset(self.get_queryset()).order_by('-created_at')[:int(next)]
        serializer = self.get_serializer(queryset, many=True)

        return Response({
            "post": serializer.data,
            "has_more": True,
        })


# Post search 전용 뷰 / URL: search/
class PostFilterView(ListModelMixin, GenericViewSet):
    queryset = Post.objects.all()\
        .select_related("video__post_video", "video__author", "author")\
        .prefetch_related("post_group")
    serializer_class = PostSerializer
    ordering = ['id']

    def list(self, request, *args, **kwargs):
        title = request.GET.get('title')

        if title:
            queryset = self.filter_queryset(self.get_queryset()).filter(title__contains=title)
            serializer = self.get_serializer(queryset, many=True)
        else:
            serializer = self.get_serializer(None, many=True)
        return Response(serializer.data)


# 회원별 Profile Post View / URL: post-user/
# 이건 다른 사람이 볼 수 있는 프로파일 뷰 이므로 삭제하는 코드는 지워도될듯
class PostProfileView(ListModelMixin, GenericViewSet):
    queryset = Post.objects.all()\
        .select_related("video__post_video", "video__author", "author")\
        .prefetch_related("post_group")
    serializer_class = PostSerializer
    ordering = ['id']

    def list(self, request, *args, **kwargs):
        username = request.GET.get("user")
        user_check = False
        if username:
            if str(request.user) == username:
                user_check=True
            user = get_user_model().objects.get(username=username)
            queryset = self.get_queryset().filter(author=user.id)
            serializer = self.get_serializer(queryset, many=True)
            return Response({"data": serializer.data, "userCheck": user_check })
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# 회원이 Post 수정, 삭제 가능한 뷰
# update, delete, list 사용 / retrieve는 PostModelViewSet에서 사용
# url : post-user-view
class PostUserView(viewsets.ModelViewSet):
    queryset = (
        Post.objects.all()
            .select_related("video__post_video", "video__author", "author")\
            .prefetch_related("post_group")
    )
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['id']

    def list(self, request, *args, **kwargs):
        user = request.user
        q = self.get_queryset().filter(author=user)
        serializer = self.get_serializer(q, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        print(request.data)
        post = get_object_or_404(Post, pk=kwargs['pk'])
        if request.user == post.author:
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)


# Comment Read Create Delete Put View / URL: post/pk/comments
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()\
        .select_related("author", "post", "post__video", "post__author", "post__video__author").\
        prefetch_related("post__post_group")
    serializer_class = CommentSerializer
    ordering = ['id']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(post__pk=self.kwargs["post_pk"])
        return qs

    def perform_create(self, serializer):
        post = get_object_or_404(Post, pk=self.kwargs["post_pk"])
        serializer.save(author=self.request.user, post=post)
        return super().perform_create(serializer)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        comment = get_object_or_404(Comment, pk=kwargs['pk'])
        if request.user == comment.author:
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        comment_pk = self.kwargs['pk']
        comment = get_object_or_404(Comment, pk=comment_pk)
        if request.user == comment.author:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"data": request.data}, status=status.HTTP_400_BAD_REQUEST)




