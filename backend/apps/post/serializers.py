from rest_framework import serializers, parsers
from rest_framework.exceptions import NotAcceptable
from rest_framework.serializers import HyperlinkedModelSerializer
from django.forms import ImageField as DjangoImageField
from rest_framework.utils import json

from apps.post.models import Post, PostImage
from apps.users.serializers import UserSerializer


class PostImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostImage
        fields = ['id', 'post', 'images']

        extra_kwargs = {
            'post': {'required': False}
        }

    def validate(self, attrs):
        default_error_messages = {
            'invalid_image':
                'Upload a valid image. The file you uploaded was either not an image or a corrupted image.',
        }

        for i in self.initial_data.getlist('images'):
            django_field = DjangoImageField()
            django_field.error_messages = default_error_messages
            django_field.clean(i)
        return attrs


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    fk_post_image = PostImageSerializer(many=True, required=False)

    class Meta:
        model = Post
        fields = ['id', 'post_title', 'post_content', 'fk_post_image', 'author', 'og_title', 'og_description', 'og_image', 'og_url', 'date_published']

    def create(self, validated_data):
        # create product
        print("validated data", validated_data)
        print('101', len(validated_data['og_title']))

        try:
            if len(validated_data['og_title']) > 0:
                post_obj = Post.objects.create(
                    author=self.context['request'].user,
                    post_title=validated_data['post_title'],
                    post_content=validated_data['post_content'],
                    og_title=validated_data['og_title'],
                    og_description=validated_data['og_description'],
                    og_image=validated_data['og_image'],
                    og_url=validated_data['og_url']
                )
            else:
                post_obj = Post.objects.create(
                    author=self.context['request'].user,
                    post_title=validated_data['post_title'],
                    post_content=validated_data['post_content'],
                )

        except Exception:
            raise NotAcceptable(detail={'message': 'The request is not acceptable.'}, code=406)

        if 'included_images' in self.context:  # checking if key is in context
            images_data = self.context['included_images']
            for i in images_data.getlist('images'):
                PostImage.objects.create(
                    post=post_obj,
                    images=i
                )
                print('created postimage')
        return post_obj


class MultipartJsonParser(parsers.MultiPartParser):

    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(
            stream,
            media_type=media_type,
            parser_context=parser_context
        )
        data = {}

        for key, value in result.data.items():
            if type(value) != str:
                data[key] = value
                continue
            if '{' in value or "[" in value:
                try:
                    data[key] = json.loads(value)
                except ValueError:
                    data[key] = value
            else:
                data[key] = value
        return parsers.DataAndFiles(data, result.files)
