import channels
from asgiref.sync import async_to_sync
from channels.exceptions import StopConsumer
from channels.generic.websocket import WebsocketConsumer
import json
import time
import urllib.parse
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from datetime import datetime
from dateutil import tz
from django.core.mail import EmailMessage
import re

from .models import Chat


def getTimePrefix():
    return '[' + str(int(time.time())) + ']: '


User = get_user_model()


class ChatConsumer(WebsocketConsumer):

    def init_chat(self, data):

        print(getTimePrefix() + 'init_chat 101')

        print(getTimePrefix())
        print(data)

        username = data['username']
        # user, created = User.objects.get_or_create(username=username, email=username)
        Chat.objects.filter(room_name=self.room_name).update(customer=username)

        print('init_chat 102')
        content = {
            'command': 'init_chat'
        }
        print("ChatConsumer 101")
        # if not chat:
        #     content['error'] = "Unable to get or create User with username: " + username
        #     self.send_message(content)

        content['success'] = "Chatting in with success with username: " + username
        self.send_message(content)

    def new_message(self, data):
        print(getTimePrefix() + 'got new message')
        # print(getTimePrefix() + data)
        author = data['from']
        text = data['text']

        # message = Chat.objects.create(author=author_user, content=text, chat_id=self.room_name, seller_id=operator, active=True)


        previousMessages = Chat.objects.filter(room_name=self.room_name).distinct('messages').values()[0]['messages']

        print("previous MSG", previousMessages)

        def findUrls(string):
            regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
            urls = re.findall(regex, string)
            return [x[0] for x in urls]

        textUrls = findUrls(text)

        formattedText = text

        if len(textUrls) > 0:

            for url in reversed(textUrls):
                fullUrl = '<a href="' + url + '" target="_blank">' + url + '</a>'

                formattedText = formattedText.replace(url, fullUrl)

        newMessage = {
            'author': author,
            'time': str(int(time.time())),
            'body': {
                'type': 'text',
                'content': formattedText
            }
        }

        if not previousMessages:

            previousMessages = {}

        previousMessages[len(previousMessages)] = newMessage

        Chat.objects.filter(room_name=self.room_name).update(messages=previousMessages)

        # 'body': {
        #     'type': 'file',
        #     'content': {
        #         'filetype': 'png',
        #         'url': 'xyz.png'
        #     }
        # }

        content = {
            'command': 'new_message',
            'message': self.message_to_json(newMessage)
        }
        self.send_chat_message(content)

    #

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'author': message['author'],
            'body': message['body'],
            'created_at': str(message['time'])
        }

    def file_message(self, data):
        print("file message first data", data)
        for cMsg in data["files"]:


            content = {
                'command': 'new_message',
                'message': cMsg
            }
            print("file message content", content)
            self.send_chat_message(content)

    commands = {
        'init_chat': init_chat,
        # 'init_chat_staff': init_chat_staff,
        'new_message': new_message,
        # 'fetch_messages': fetch_messages,
        'file_message': file_message

    }

    def connect(self):

        print('connect 101')
        # other_user = self.scope['url_route']['kwargs']['username']
        # me = self.scope['user']

        operator = self.scope['url_route']['kwargs']['operator']
        customer = self.scope['url_route']['kwargs']['username']


        print(operator)
        print(customer)

        self.room_name = operator + '_' + customer
        self.room_group_name = 'chat_%s' % self.room_name

        Chat.objects.get_or_create(room_name=self.room_name, operator_id=operator)
        ## TODO: Send command if customer connect or disconnect, if yes (active=True) else (pass)
        Chat.objects.filter(room_name=self.room_name).update(active=True)

        ## TODO: Get Operator Email

        op_email = User.objects.filter(id=operator).distinct("email").values()[0]["email"]

        ## TODO: SEND EMAIL TO OPERATOR

        email = EmailMessage(
            f'Neuer Chat mit {customer}',
            f'Ein neuer Kundenchat auf <a href="https://autograf.ch/livechat">https://autograf.ch/livechat</a>',
            'system@live.auto-zuerisee.ch',
            [op_email],
        )
        email.content_subtype = "html"
        email.send(fail_silently=False)


        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # leave group room
        Chat.objects.update(active=False)

        # send Email to Operator
        operator = self.scope['url_route']['kwargs']['operator']
        customer = self.scope['url_route']['kwargs']['username']
        room_name = operator + "_" + customer

        op_email = User.objects.filter(id=operator).distinct("email").values()[0]["email"]
        customer_email = Chat.objects.filter(room_name=room_name).distinct("customer").values()[0]["customer"]
        messages = Chat.objects.filter(room_name=room_name).distinct("messages").values()[0]["messages"]
        print(messages)

        def timestampToDateTime(time):
            zurichTimezone = tz.gettz('Europe/Zurich')
            return str(datetime.fromtimestamp(time).astimezone(zurichTimezone))

        messagesMailContent = ''

        for msgIdx, msg in messages.items():

            messagesMailContent += '<strong>' + 'Von: ' + msg['author'] + '</strong><br />'
            messagesMailContent += 'Zeit: ' + timestampToDateTime(int(msg['time'])) + '<br />'

            if msg["body"]["type"] == "text":
                messagesMailContent += 'Nachricht: ' + msg['body']['content'] + '<br /><br />'
            else:
                messagesMailContent += f'Nachricht: <a href="https://live.auto-zuerisee.ch/userfiles/{room_name}/{msg["body"]["content"]}" target="_blank">File</a><br /><br />'

        # messagesMailContent += f'<a href="mailto:{customer_email}"><button>Antworten.</button></a>'

        email = EmailMessage(
            f'Chat mit {customer_email}',
            f'{messagesMailContent}',
            'system@live.auto-zuerisee.ch',
            [op_email],
            reply_to=[customer_email],
        )
        email.content_subtype = "html"
        email.send(fail_silently=False)

        # send_mail(
        #     f'Chat mit {customer_email}',
        #     f'Chat mit {customer_email}',
        #     'system@live.auto-zuerisee.ch - Do NOT Reply',
        #     [op_email],
        #     fail_silently=False,
        #     html_message=messagesMailContent,
        # )
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )


    def receive(self, text_data):
        data = json.loads(text_data)

        self.commands[data['command']](self, data)
        print("receive 102")

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def send_chat_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps(message))


class AdminConsumer(WebsocketConsumer):

    def init_chat(self, data):

        print(getTimePrefix() + 'init_chat 101')

        print(getTimePrefix())
        print(data)

        username = data['username']
        # user, created = User.objects.get_or_create(username=username, email=username)
        Chat.objects.filter(room_name=self.room_name).update(customer=username)

        print('init_chat 102')
        content = {
            'command': 'init_chat'
        }
        print("ChatConsumer 101")
        # if not chat:
        #     content['error'] = "Unable to get or create User with username: " + username
        #     self.send_message(content)

        content['success'] = "Chatting in with success with username: " + username
        self.send_message(content)

    def new_message(self, data):
        print(getTimePrefix() + 'got new message')
        # print(getTimePrefix() + data)
        author = data['from']
        text = data['text']

        # message = Chat.objects.create(author=author_user, content=text, chat_id=self.room_name, seller_id=operator, active=True)

        ## TODO: Get previous messages from database
        previousMessages = Chat.objects.filter(room_name=self.room_name).distinct('messages').values()[0]['messages']

        print("previous MSG", previousMessages)

        def findUrls(string):
            regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
            urls = re.findall(regex, string)
            return [x[0] for x in urls]

        textUrls = findUrls(text)

        formattedText = text

        if len(textUrls) > 0:

            for url in reversed(textUrls):

                fullUrl = '<a href="' + url + '" target="_blank">' + url + '</a>'

                formattedText = formattedText.replace(url, fullUrl)

        newMessage = {
            'author': author,
            'time': str(int(time.time())),
            'body': {
                'type': 'text',
                'content': formattedText
            }
        }

        if not previousMessages:

            previousMessages = {}

        previousMessages[len(previousMessages)] = newMessage

        Chat.objects.filter(room_name=self.room_name).update(messages=previousMessages)

        # 'body': {
        #     'type': 'file',
        #     'content': {
        #         'filetype': 'png',
        #         'url': 'xyz.png'
        #     }
        # }

        content = {
            'command': 'new_message',
            'message': self.message_to_json(newMessage)
        }
        self.send_chat_message(content)

    #

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'author': message['author'],
            'body': message['body'],
            'created_at': str(message['time'])
        }
    def file_message(self, data):

        print("file message first data", data)

        for cMsg in data["files"]:


            content = {
                'command': 'new_message',
                'message': cMsg
            }
            print(content)
            self.send_chat_message(content)

    commands = {
        'init_chat': init_chat,
        # 'init_chat_staff': init_chat_staff,
        'new_message': new_message,
        # 'fetch_messages': fetch_messages,
        'file_message': file_message
    }

    def connect(self):

        print('connect 101')
        # other_user = self.scope['url_route']['kwargs']['username']
        # me = self.scope['user']

        operator = self.scope['url_route']['kwargs']['operator']
        customer = self.scope['url_route']['kwargs']['username']


        print(operator)
        print(customer)

        self.room_name = operator + '_' + customer
        self.room_group_name = 'chat_%s' % self.room_name

        Chat.objects.get_or_create(room_name=self.room_name, operator_id=operator)
        ## TODO: Send command if customer connect or disconnect, if yes (active=True) else (pass)
        # Chat.objects.filter(room_name=self.room_name).update(active=True)


        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

        # messages = Chat.objects.get(room_name=self.room_name).values('messages')
        #
        # # 'body': {
        # #     'type': 'file',
        # #     'content': {
        # #         'filetype': 'png',
        # #         'url': 'xyz.png'
        # #     }
        # # }
        #
        # content = {
        #     'command': 'new_message',
        #     'message': self.message_to_json(messages)
        # }
        # self.send_chat_message(content)

    def disconnect(self, close_code):
        # leave group room
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        # raise StopConsumer()

    def receive(self, text_data):
        data = json.loads(text_data)

        self.commands[data['command']](self, data)
        print("receive 102")

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def send_chat_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps(message))
