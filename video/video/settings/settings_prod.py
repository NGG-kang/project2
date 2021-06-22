from .settings_common import *
import CustomS3Boto3Storage


INSTALLED_APPS += [
    'storages',
]

DEBUG = False
INTERNAL_IPS = [
    "*",
    '127.0.0.1',
    '172.31.41.0',
    '15.164.104.62',
    'd8r7r1yiurfuw.cloudfront.net',
]
CHARSET = 'utf8'
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': 'database-1.ceej7pcmvlvh.ap-northeast-2.rds.amazonaws.com',
        'PORT': '5432',
        'NAME': get_secret("DB_NAME"),
        'USER': get_secret("DB_USER"),
        'PASSWORD': get_secret("DB_PASSWORD"),
    }
}

AWS_REGION = 'ap-northeast-2'
AWS_STORAGE_BUCKET_NAME = 'skarndrkd-test'
AWS_S3_CUSTOM_DOMAIN = '%s.s3.%s.amazonaws.com' % (
    AWS_STORAGE_BUCKET_NAME, AWS_REGION)

AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
AWS_S3_FILE_OVERWRITE = False
# Static Setting
STATIC_URL = "https://%s/" % AWS_S3_CUSTOM_DOMAIN
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3StaticStorage'

# Media Setting
MEDIA_URL = "https://%s/media/" % AWS_S3_CUSTOM_DOMAIN
DEFAULT_FILE_STORAGE = 'CustomS3Boto3Storage.CustomS3Boto3Storage'


AWS_ACCESS_KEY_ID = get_secret("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = get_secret("AWS_SECRET_ACCESS_KEY")


AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
AWS_DEFAULT_ACL = 'public-read'
AWS_LOCATION = 'static'
STATIC_URL = 'https://%s/%s/' % (AWS_S3_CUSTOM_DOMAIN, AWS_LOCATION)
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static')
]