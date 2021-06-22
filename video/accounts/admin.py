from django.contrib import admin
from .models import Subscribe, User



@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass


@admin.register(Subscribe)
class SubscribeAdmin(admin.ModelAdmin):
    pass

