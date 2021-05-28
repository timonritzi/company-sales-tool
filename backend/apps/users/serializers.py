from django.contrib.auth import get_user_model
from rest_framework import serializers
from apps.post.models import Post
from apps.chat.models import Chat

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    # chats = serializers.SerializerMethodField()
    #
    # def get_chats(self, user):
    #     chats = []
    #     user_chats = Chat.objects.filter(operator_id=user.id).distinct('id').values()
    #     for chat in user_chats:
    #         chats.append(chat['id'])
    #     return chats

    def get_posts_by_user(self, user):
        return Post.objects.filter(author=user).count()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name',
                  'last_name', 'location', 'about', 'phone',
                  'avatar', 'date_joined','address', 'position', 'fk_post_author', 'salesman', 'rang', 'status', 'autohaus']
