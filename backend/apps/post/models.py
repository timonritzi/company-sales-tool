from django.db import models
from django.contrib.auth import get_user_model

from project import settings
User = get_user_model()


class Post(models.Model):
    author = models.ForeignKey(to=settings.AUTH_USER_MODEL, related_name='fk_post_author', on_delete=models.CASCADE)
    post_title = models.TextField(max_length=100)
    post_content = models.TextField(max_length=1000)
    og_title = models.TextField(max_length=1000, blank=True, null=True)
    og_description = models.TextField(max_length=1000, blank=True, null=True)
    og_image = models.TextField(max_length=1000, blank=True, null=True)
    og_url = models.TextField(max_length=1000, blank=True, null=True)
    date_published = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.post_title


# class Item(models.Model):
#     name = models.CharField(max_length=100)
#     category = models.ForeignKey(Category, related_name='items')
#
#     def __unicode__(self):
#         return self.name

class PostImage(models.Model):
    post = models.ForeignKey(Post, default=None, related_name='fk_post_image', on_delete=models.CASCADE)
    images = models.FileField(upload_to='images/', verbose_name='image')

    def __str__(self):
        return f"{self.id}: image from post {self.post.id}"
