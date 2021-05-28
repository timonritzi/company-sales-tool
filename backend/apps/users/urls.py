from django.urls import path

from apps.users.views import ListUsers, GetPatchUsers, GetUser

urlpatterns = [
    path('all/', ListUsers.as_view()),
    path('me/', GetPatchUsers.as_view()),
    path('<str:username>/', GetUser.as_view())
]
