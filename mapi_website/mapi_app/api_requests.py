from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.template.context_processors import request
from django.core.paginator import Paginator
from django.contrib.auth.models import User
from django.http import HttpResponse
import json

def home(request):
    response = {}
    response['message'] = 'Test api rest'
    response['status'] = '200'
    response['status_code'] = 'OK'
    print(response)
    return HttpResponse(json.dumps(response), content_type = 'application/json')