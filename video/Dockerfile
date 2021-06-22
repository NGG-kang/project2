FROM python:3
ENV PYTHONBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=video.settings.settings_prod
WORKDIR /backend
ADD secrets.json /
ADD CustomS3Boto3Storage.py /
COPY . /backend/
RUN pip install -r requirements.txt
CMD ["gunicorn", "video.wsgi:application", "--bind", "0.0.0.0:8000"]
EXPOSE 8000
