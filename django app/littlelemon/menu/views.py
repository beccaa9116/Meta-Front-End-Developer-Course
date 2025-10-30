from django.shortcuts import render, get_object_or_404
from .models import MenuItem
def home(request): return render(request, "home.html")
def about(request): return render(request, "about.html")
def book(request): return render(request, "book.html")
def menu_list(request):
    items = MenuItem.objects.all()
    return render(request, "menu.html", {"items": items})
def item_detail(request, pk):
    item = get_object_or_404(MenuItem, pk=pk)
    return render(request, "menu_item.html", {"item": item})
