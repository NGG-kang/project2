from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate
from django.contrib.auth import get_user_model
# Create your tests here.


factory = APIRequestFactory()
user = get_user_model().get(pk=1)
content_type = 'multipart/form-data'
request = factory.post('/post/', {"author": user, "title": "test title", "video": "testVideo", "thumb_nail": "testThumbNail" })
force_authenticate(request, user=user)
