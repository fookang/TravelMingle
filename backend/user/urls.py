from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('', views.GetUserView.as_view(), name='profile'),
    path('update/', views.UpdateUserView.as_view(), name='update'),
    path('delete/', views.DeleteUserView.as_view(), name='delete'),
    path('change-password/', views.ChangePasswordView.as_view(),
         name='change-password'),
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
]
