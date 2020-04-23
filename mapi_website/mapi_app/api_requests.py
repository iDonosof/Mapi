from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.template.context_processors import request
from django.core.paginator import Paginator
from django.contrib.auth.models import User
from django.http import HttpResponse
import json

from .models import Event, Entertainment_areas

def home(request):
    response = {}
    response["message"] = "Test api rest"
    response["status"] = "200"
    response["status_code"] = "OK"
    return HttpResponse(json.dumps(response), content_type = "application/json")

def map_events_list(request):
    event_list = []
    events = Event.objects.filter(event_available = 1).values("id", "event_name", "event_coordinates_altitude",
    "event_coordinates_latitude")
    areas = Entertainment_areas.objects.filter(area_available = 1).values("id", "area_name",
    "area_coordinates_altitude", "area_coordinates_latitude")
    try:
        for event in events:
            event_list.append({
                "id": event.id,
                "name": event.event_name,
                "altitude": event.event_coordinates_altitude,
                "latitude": event.event_coordinates_latitude
            })
    except:
        pass
    try: 
        for area in areas:
            event_list.append({
                "id": event.id,
                "name": event.event_name,
                "altitude": event.event_coordinates_altitude,
                "latitude": event.event_coordinates_latitude
            })
    except:
        pass
    if len(event_list):
        response = {}
        response["status"] = 404
        response["message"] = "No data found"
        response["status_code"] = "NOT_FOUND"
        return HttpResponse(json.dumps(response), content_type = "application/json")
    return HttpResponse(json.dumps(event_list), content_type = "application/json")