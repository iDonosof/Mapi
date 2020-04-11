from . import views
from . import api_requests
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    #views
    path('', views.home, name='home'),

    #api rest
    path('api/api-test', api_requests.home)
] #+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)