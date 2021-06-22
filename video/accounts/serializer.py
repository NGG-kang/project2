import json
from rest_framework import serializers
from .models import Subscribe, User
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'last_login', 'first_name', 'last_name', 'date_joined']
        # fields = '__all__'


class SubscribeSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    sub_users = serializers.SerializerMethodField()

    def get_sub_users(self, author):
        return [i.username for i in author.subscribe_set.all()]

    class Meta:
        model = Subscribe
        fields = ['author', 'subscribe_set', 'subscribing_set', 'sub_users']


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = get_user_model().objects.create(username=validated_data["username"])
        user.set_password(validated_data["password"])
        user.save()
        return user

    class Meta:
        model = User
        fields = ["pk", "username", "password"]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        try:
            request = self.context["request"]
        except KeyError:
            pass

        try:
            request_data = json.loads(request.body)
            if("username" in request_data and "password" in request_data):
                # default scenario in simple-jwt
                pass
            elif("username" in request_data and "otp" in request_data):
                # validate username/otp manually and return access/token pair if successful
                pass

            else:
                # some fields were missing
                raise serializers.ValidationError({"username/otp or username/password" : "These fields are required"})

        except:
            pass