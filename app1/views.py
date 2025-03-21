from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import render, redirect

def custom_403(request, title=None, message=None):
    return HttpResponseForbidden(render(request, 'custom_403.html', context=
    {
        'message': message,
        'title': title
    }))