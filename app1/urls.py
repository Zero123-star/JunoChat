from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("403", views.custom_403, name="error_403"),
    path("signup/", views.signup_view, name='signup_view'),
    path("login/", views.login_view, name='login_view'),
    path("logout/", views.logout_view, name='logout_view'),
    path('profile/', views.profile_view, name='profile'),
    path('password_change/', auth_views.PasswordChangeView.as_view(template_name='password_change.html', success_url='/app/profile/'), name='password_change'),
    path('confirm_mail/<str:code>/', views.confirm_email, name='confirm_email'),
    path("contact", views.contact, name="contact")
    #path("", views.index, name='index'),
]