from django.contrib.auth import get_user_model
from rest_framework import filters

from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, RetrieveAPIView

from apps.users.serializers import UserSerializer

User = get_user_model()


class ListUsers(ListAPIView):
    search_fields = ['first_name', 'last_name', 'username']
    filter_backends = (filters.SearchFilter,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.all().filter(salesman=True).order_by('-rang')




class GetPatchUsers(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []

    def get_object(self):
        return self.request.user


class GetUser(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
