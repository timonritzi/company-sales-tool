from rest_framework import serializers, parsers
from rest_framework.exceptions import NotAcceptable
from django.forms import FileField
from rest_framework.utils import json

from .models import Chat


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = "__all__"
