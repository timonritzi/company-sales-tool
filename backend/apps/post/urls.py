from django.urls import path

from apps.post.views import CreatePostView, RetrieveUpdateDestroyPost, RetrieveUpdateDestroyImage, ListPostsUser, ListPostsLoggedInUser

urlpatterns = [
    # Post
    path('create/', CreatePostView.as_view()),
    path('<int:id>/', RetrieveUpdateDestroyPost.as_view()),
    path('images/<int:id>/', RetrieveUpdateDestroyImage.as_view()),
    path('user/<str:username>/', ListPostsUser.as_view()),
    path('user/', ListPostsLoggedInUser.as_view()),
]
