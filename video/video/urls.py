from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from board.views import CommentViewSet, PostModelViewSet, PostScrollView, PostFilterView, PostProfileView, PostUserView,VideoGroupModelViewSet, VideoModelViewSet
from accounts.views import UserViewSet, SubscribeViewSet, SignupView, LoginUserViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
import debug_toolbar


router = routers.DefaultRouter()
# video
router.register(r'video', VideoModelViewSet, basename='video')
router.register(r'video-group', VideoGroupModelViewSet, basename='video-group')
# post
router.register(r'post', PostModelViewSet, basename='post')
router.register(r'post-infinity-scroll', PostScrollView, basename='post_infinity_scroll')
router.register(r'search', PostFilterView, basename='search')
router.register(r'post-user', PostProfileView, basename='post_user')
router.register(r'post-user-view', PostUserView, basename='post_user_view')
# comment
router.register(r"posts/(?P<post_pk>\d+)/comments", CommentViewSet)
router.register(r"posts/(?P<post_pk>\d+)/comments/delete", CommentViewSet)
# user
router.register(r'user', UserViewSet, basename='user')
router.register(r'login-user', LoginUserViewSet, basename='login-user')
router.register(r'subscribe', SubscribeViewSet, basename='subscribe')
router.register(r'accounts/signup', SignupView, basename='signup')



urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('accounts/', include('rest_auth.urls')),
    path('accounts/', include('allauth.urls')),
    path('accounts/', include('accounts.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # 로그인으로 사용됨
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('__debug__/', include(debug_toolbar.urls)),

]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

