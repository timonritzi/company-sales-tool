from django.urls import path

from apps.chat.views import ListOfChatsView

urlpatterns = [
    path('<int:operator_id>', ListOfChatsView.as_view())
]