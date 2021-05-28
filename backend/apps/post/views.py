from rest_framework import status
from rest_framework.exceptions import NotAcceptable
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, ListCreateAPIView
from rest_framework.parsers import JSONParser

from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.post.models import Post, PostImage
from apps.post.serializers import PostSerializer, PostImageSerializer, MultipartJsonParser

import re
import requests
import bs4


class RetrieveUpdateDestroyPost(RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'id'


class CreatePostView(ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    parser_classes = [MultipartJsonParser, JSONParser]

    def get_serializer_context(self):
        context = super(CreatePostView, self).get_serializer_context()

        if len(self.request.FILES) > 0:
            context.update({
                'included_images': self.request.FILES
            })
        return context

    def create(self, request, *args, **kwargs):

        # Post Content Data
        post_content_data = self.request.data['post_content']

        # Find Url in a string Func
        def FindUrl(string):
            regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
            url = re.findall(regex, string)
            return [x[0] for x in url]

        # String to List Func
        def ConvertToList(string):
            li = list(string.split())
            return li

        # List to String Func
        def ListToString(s):
            str1 = ""
            for ele in s:
                str1 += ele
            return str1

        # Extracting Url from Post_Content
        url = FindUrl(post_content_data)

        if len(url) > 0:
            # Making a list out of post_content req.data
            post_content_data_list = ConvertToList(post_content_data)
            url_string = ListToString(url)
            print("MOTHERFUCKER", url_string)
            post_content_data_list.remove(url_string)

            # Making a string out of post_content_data_list
            post_content_data = " ".join(str(x) for x in post_content_data_list)
            print("Post Content without URL:", post_content_data)

            # Updating re.data Post Content
            self.request.data['post_content'] = post_content_data
            print(post_content_data)

            # Fetching Data
            s = requests.Session()
            s.headers.update({
                'User-Agent': 'facebookexternalhit/1.1'
            })
            x = s.get(url_string)

            # Fetch Data = Page Content
            pageContent = x.content.decode('utf-8', 'ignore')

            # Parse pagecontent with bs4 to get og:tags
            head = bs4.BeautifulSoup(pageContent)

            ogTitle = head.find(property=re.compile(r'^og:title'))
            ogDescription = head.find(property=re.compile(r'^og:description'))
            ogImage = head.find(property=re.compile(r'^og:image'))
            ogUrl = head.find(property=re.compile(r'^og:url'))

            ogTitle = ogTitle['content'] if ogTitle else ''
            ogDescription = ogDescription['content'] if ogDescription else ''
            ogImage = ogImage['content'] if ogImage else ''
            ogUrl = ogUrl['content'] if ogUrl else ''

            self.request.data['og_title'] = ogTitle
            self.request.data['og_description'] = ogDescription
            self.request.data['og_image'] = ogImage
            self.request.data['og_url'] = ogUrl
        else:
            self.request.data['og_title'] = ''
            self.request.data['og_description'] = ''
            self.request.data['og_image'] = ''
            self.request.data['og_url'] = ''

        # Create Method and Saving Instance
        try:
            image_serializer = PostImageSerializer(data=request.FILES)
            image_serializer.is_valid(raise_exception=False)
        except Exception:
            raise NotAcceptable(
                detail={
                    "message": "Upload a valid image. The file you uploaded was either not "
                               "an image or a corrupted image.!"}, code=406)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        print(serializer.data)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class RetrieveUpdateDestroyImage(RetrieveUpdateDestroyAPIView):
    queryset = PostImage.objects.all()
    serializer_class = PostImageSerializer
    lookup_field = "id"


class ListPostsUser(ListAPIView):
    serializer_class = PostSerializer
    lookup_field = 'username'

    def get_queryset(self):
        username = self.kwargs.get("username")
        return Post.objects.filter(author__username=username).order_by("-date_published")


class ListPostsLoggedInUser(ListAPIView):
        serializer_class = PostSerializer

        def get_queryset(self):
            return Post.objects.filter(author=self.request.user).order_by("-date_published")
