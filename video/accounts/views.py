from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404


from .models import Subscribe
from .serializer import UserSerializer, SubscribeSerializer, SignupSerializer, MyTokenObtainPairSerializer
from board.models import Post

from rest_framework import viewsets
from rest_framework import status
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework_simplejwt.tokens import BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken, OutstandingToken




# 로그아웃 미구현, 로컬딴에서 토큰 지우기만 하는중
class BlacklistRefreshView(APIView):

    def post(self, request):
        print(request.data)
        print(request.data.get('refresh'))
        refresh_token = RefreshToken(request.data.get('refresh'))
        refresh_token.blacklist()

        access_token = BlacklistedToken(request.data.get('access'))
        access_token.blacklist()
        return Response("Success")


# All User View / URL: user/
class UserViewSet(ListModelMixin, viewsets.GenericViewSet):
    permission_classes = {permissions.IsAuthenticated}
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    ordering = ['id']


# Login User View / URL: login-user/
class LoginUserViewSet(viewsets.ModelViewSet):
    permission_classes = {permissions.IsAuthenticated}
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    ordering = ['id']

    def list(self, request, *args, **kwargs):
        print("login-user view", request.user)
        queryset = self.get_queryset().filter(username=request.user)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)


# Subscribe View, 구독, 비구독 / URL: subscribe/
class SubscribeViewSet(viewsets.ModelViewSet):
    permission_classes = {
        permissions.IsAuthenticated
    }
    queryset = Subscribe.objects.all().select_related("author__subscribe_author").prefetch_related("subscribe_set", "subscribing_set")
    serializer_class = SubscribeSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(author=request.user)
        serializer = SubscribeSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        user = get_user_model().objects.filter(username=request.data['data']['author']).values_list('id', flat=True)
        user_id = list(user)[0]

        # requset user에 대한 subscribe_set
        if request.data['data']['request'] == "subscribe":
            try:
                subscribe_set = get_object_or_404(Subscribe, author=request.user.id)
                if not subscribe_set:
                    Exception
                subscribe_set.subscribe_set.add(user_id)
            except Exception as e:
                print(e)
                data = {'author': request.user.id, 'subscribe_set': [user_id], 'subscribing_set': []}
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)

            # subscribe를 당하는 user에 대한 subscribing_set
            try:
                subscribing_set = get_object_or_404(Subscribe, author=user_id)
                if not subscribing_set:
                    Exception
                subscribing_set.subscribing_set.add(request.user.id)
            except Exception as e:
                data = {'author': user_id, 'subscribe_set': [], 'subscribing_set': [request.user.id]}
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)

            return Response({"messages": "success", "request_user": request.user.id, "subscribe_user": user_id })

        # subscribe 취소
        elif request.data['data']['request'] == "remove":
            user = get_user_model().objects.filter(username=request.data['data']['author']).values_list('id', flat=True)
            user_id = list(user)[0]
            # destroy는 이미 값이 있을테니 try catch 스킵

            subscribe_set = get_object_or_404(Subscribe, author=request.user.id)
            subscribing_set = get_object_or_404(Subscribe, author=user_id)

            subscribing_set.subscribing_set.remove(request.user.id)
            subscribe_set.subscribe_set.remove(user_id)

            return Response(
                {"messages": "success", "request_user": request.user.id, "subscribe_user": user_id, "del": "del"})


# SignupView / URL: signup/
class SignupView(CreateModelMixin, viewsets.GenericViewSet):
    model = get_user_model()
    serializer_class = SignupSerializer
    permission_classes = {
        permissions.AllowAny
    }


# 구글 인증 웹사이트에서 가져옴
# TODO: 뭔가 구글인증이 안되는거 보면 구글쪽에서 주소를 다시 등록 해줘야 할듯
from accounts.models import User
from allauth.socialaccount.models import SocialAccount
from django.conf import settings
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google import views as google_view
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.http import JsonResponse
import requests
from rest_framework import status
from json.decoder import JSONDecodeError
state = getattr(settings, 'STATE')
BASE_URL = 'http://15.164.104.62:8000/'
GOOGLE_CALLBACK_URI = BASE_URL + 'accounts/google/callback/'


def google_callback(request):
    client_id = getattr(settings, "SOCIAL_AUTH_GOOGLE_CLIENT_ID")
    client_secret = getattr(settings, "SOCIAL_AUTH_GOOGLE_SECRET")
    code = request.GET.get('code')
    """
    Access Token Request
    """
    token_req = requests.post(
        f"https://oauth2.googleapis.com/token?client_id={client_id}&client_secret={client_secret}&code={code}&grant_type=authorization_code&redirect_uri={GOOGLE_CALLBACK_URI}&state={state}")
    token_req_json = token_req.json()
    error = token_req_json.get("error")
    if error is not None:
        raise JSONDecodeError(error)
    access_token = token_req_json.get('access_token')
    """
    Email Request
    """
    email_req = requests.get(
        f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}")
    email_req_status = email_req.status_code
    if email_req_status != 200:
        return JsonResponse({'err_msg': 'failed to get email'}, status=status.HTTP_400_BAD_REQUEST)
    email_req_json = email_req.json()
    email = email_req_json.get('email')
    """
    Signup or Signin Request
    """
    try:
        user = User.objects.get(email=email)
        # 기존에 가입된 유저의 Provider가 google이 아니면 에러 발생, 맞으면 로그인
        # 다른 SNS로 가입된 유저
        social_user = SocialAccount.objects.get(user=user)
        if social_user is None:
            return JsonResponse({'err_msg': 'email exists but not social user'}, status=status.HTTP_400_BAD_REQUEST)
        if social_user.provider != 'google':
            return JsonResponse({'err_msg': 'no matching social type'}, status=status.HTTP_400_BAD_REQUEST)
        # 기존에 Google로 가입된 유저
        data = {'access_token': access_token, 'code': code}
        accept = requests.post(
            f"{BASE_URL}accounts/google/login/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({'err_msg': 'failed to signin'}, status=accept_status)
        accept_json = accept.json()
        accept_json.pop('user', None)
        return JsonResponse(accept_json)
    except User.DoesNotExist:
        # 기존에 가입된 유저가 없으면 새로 가입
        data = {'access_token': access_token, 'code': code}
        accept = requests.post(
            f"{BASE_URL}accounts/google/login/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({'err_msg': 'failed to signup'}, status=accept_status)
        accept_json = accept.json()
        accept_json.pop('user', None)
        return JsonResponse(accept_json)


class GoogleLogin(SocialLoginView):
    adapter_class = google_view.GoogleOAuth2Adapter
    callback_url = GOOGLE_CALLBACK_URI
    client_class = OAuth2Client


