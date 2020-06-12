from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

# Create your views here.
@ensure_csrf_cookie
def home(request):
    return render(request, 'mapi_app/base.html', {})