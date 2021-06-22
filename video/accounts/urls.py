from . import views
from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView

app_name = "accounts"

urlpatterns = [
    path('logout', views.BlacklistRefreshView.as_view(), name="logout"),
    path('rest-auth/google/', views.GoogleLogin.as_view(), name='google'),
    path('google/callback/', views.google_callback,      name='google_callback'),
    path('accounts/google/login/finish/', views.GoogleLogin.as_view(), name='google_login_todjango'),
]