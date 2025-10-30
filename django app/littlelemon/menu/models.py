from django.db import models
from django.urls import reverse
class MenuItem(models.Model):
    name = models.CharField(max_length=120, unique=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="menu_images/", blank=True, null=True)
    class Meta:
        ordering = ["name"]
    def __str__(self):
        return self.name
    def get_absolute_url(self):
        return reverse("menu:item_detail", args=[str(self.id)])
