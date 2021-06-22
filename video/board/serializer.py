from rest_framework import serializers
from .models import Post, Comment, Video, VideoGroup
from django.contrib.auth import get_user_model


class AuthorSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'first_name', 'last_name']


class VideoSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = Video
        fields = ['id', 'author', 'video']


class VideoGroupSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = VideoGroup
        fields = ['id', 'author', 'group_name', 'public_status']


class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    video = VideoSerializer(read_only=True)

    class Meta:
        model = Post
        # fields = '__all__'
        fields = ['id', 'author', 'title', 'video', 'thumb_nail', 'description', 'public_status', 'post_group', 'views_count', 'created_at', 'updated_at']


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    post = PostSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'message', 'created_at']
