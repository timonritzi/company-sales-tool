import os
from secrets import token_hex
import time
import json

from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView, CreateAPIView

from .models import Chat
from .serializers import ChatSerializer

UPLOAD_BASEPATH = '/userfiles/'
ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webm', 'pdf']


class ListOfChatsView(ListAPIView):
    serializer_class = ChatSerializer
    lookup_field = 'id'

    def get_queryset(self):
        operator = self.kwargs.get("id")
        return Chat.objects.filter(operator_id=operator).order_by('-active', '-date_created', '-id')


class ListMessages(ListAPIView):
    serializer_class = ChatSerializer
    lookup_field = "id"

    def get_queryset(self):
        room_id = self.kwargs.get("id")
        return Chat.objects.filter(id=room_id)


class Files(CreateAPIView):
    serializer_class = ChatSerializer
    queryset = Chat.objects.all()

    def post(self, request, *args, **kwargs):

        print("upload Func initiated, 101")

        data = self.request.data

        print("request Data", data)

        print(request.FILES)

        room_name = data["room_name"]

        operator = data["operator_id"]
        author = data["author"]

        uploadMessages = []

        roomPath = UPLOAD_BASEPATH + room_name

        uploadAuthor = author

        if not os.path.exists(roomPath):
            os.mkdir(roomPath)

        for cFile in request.FILES.getlist('files'):

            print(cFile)

            fileName, fileExtension = cFile.name.split('.')

            if fileExtension.lower() not in ALLOWED_EXTENSIONS:
                continue

            nFileName = token_hex(8)
            nFilePath = roomPath + '/' + nFileName + '.' + fileExtension

            with open(nFilePath, 'wb+') as of:

                for chunk in cFile.chunks():
                    of.write(chunk)

            ## TODO: Retrieve messages for this chatroom from database

            previousMessages = Chat.objects.filter(room_name=room_name).distinct('messages').values()[0]['messages']

            print("previous MSG", previousMessages)

            newMessage = {
                'author': uploadAuthor,
                'time': str(int(time.time())),
                'body': {
                    'type': 'file',
                    'content': nFileName + '.' + fileExtension,
                    'ext': fileExtension
                }
            }

            if not previousMessages:
                previousMessages = {}

            previousMessages[len(previousMessages)] = newMessage

            uploadMessages.append(newMessage)

            Chat.objects.filter(room_name=room_name).update(messages=previousMessages)

            ## TODO: Append new message with type file and '''url''' is nFilePath
            ## nFileName + '.' + fileExtension

            ## TODO: Update database messages in json

            ## TODO: Append new message to uploadMessages list

            ## TODO: Return uploadMessages as json response
        print(uploadMessages)
        return JsonResponse(uploadMessages, status=status.HTTP_200_OK, safe=False)
