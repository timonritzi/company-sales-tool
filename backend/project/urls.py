"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin

from django.urls import path, include, re_path
from django.views.static import serve
from rest_framework_simplejwt import views as jwt_views

from apps.chat.views import ListOfChatsView, ListMessages, Files

urlpatterns = [

    # Backend ADMIN
    path('backend/admin/', admin.site.urls),

    # Post
    path('backend/api/posts/', include('apps.post.urls')),

    # User
    path('backend/api/users/', include('apps.users.urls')),

    # TOKEN
    path('backend/api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('backend/api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('backend/api/token/verify/', jwt_views.TokenVerifyView.as_view(), name='token_refresh'),

    # get Chats
    path('backend/api/whatever/chats/<int:id>', ListOfChatsView.as_view()),
    path('backend/api/messages/<int:id>', ListMessages.as_view()),
    path('backend/api/files/', Files.as_view())

]

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    }),
    #re_path(r'static-files/(?P<path>.*)$', serve, {
    #    'document_root': settings.STATIC_ROOT
    #})
]


