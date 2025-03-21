from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("403", views.custom_403, name="error_403"),
    #path("", views.index, name='index'),
]