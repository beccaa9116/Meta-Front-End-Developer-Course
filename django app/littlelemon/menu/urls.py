from django.urls import path
from . import views
app_name = "menu"
urlpatterns = [
    path("", views.home, name="home"),
    path("about/", views.about, name="about"),
    path("menu/", views.menu_list, name="menu_list"),
    path("book/", views.book, name="book"),
    path("menu/<int:pk>/", views.item_detail, name="item_detail"),
]
