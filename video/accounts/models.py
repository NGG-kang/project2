from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver


class User(AbstractUser):
    pass


@receiver(post_save, sender=User)
def create_Post(sender, instance, created, **kwargs):
    if created:
        if not hasattr(instance, 'Post'):
            Subscribe.objects.create(author=instance)


class Subscribe(models.Model):
    author = models.OneToOneField(get_user_model(), related_name='subscribe_author', on_delete=models.CASCADE, primary_key=True)
    subscribe_set = models.ManyToManyField(get_user_model(), related_name='subscribe', blank=True)
    subscribing_set = models.ManyToManyField(get_user_model(), related_name='subscribing', blank=True)

    def __str__(self):
        return str(self.author.username)





