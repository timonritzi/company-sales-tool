from django.conf import settings
from django.db import models

# Create your models here.

import uuid

from django.core.exceptions import ValidationError
from django.db import models


def validate_message_content(content):
    if content is None or content == "" or content.isspace():
        raise ValidationError(
            'Content is empty/invalid',
            code='invalid',
            params={'content': content},
        )


class Chat(models.Model):
    room_name = models.CharField(
        max_length=250
    )
    customer = models.CharField(
        max_length=250,
        null=True
    )
    operator_id = models.IntegerField()

    messages = models.JSONField(null=True)

    date_created = models.DateTimeField(auto_now_add=True)

    active = models.BooleanField(default=True)
