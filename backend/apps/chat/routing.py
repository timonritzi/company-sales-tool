from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.conf.urls import url
from django.urls import re_path, path

from . import consumers


websocket_urlpatterns = [
    url(r'^wss/chat/(?P<operator>\w+)/(?P<username>\w+|[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})/$', consumers.ChatConsumer.as_asgi()),
    url(r'^wss/chat/admin/(?P<operator>\w+)/(?P<username>\w+|[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})/$', consumers.AdminConsumer.as_asgi()),

    # url(r'^sup/$', consumers.ChatConsumer.as_asgi())

]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
