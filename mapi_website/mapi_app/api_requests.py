# from django.contrib.auth import authenticate, login, logout
# from django.contrib.auth.decorators import login_required, user_passes_test
# from django.core.paginator import Paginator
from django.contrib.auth.models import User
from django.template.context_processors import request
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse

from .helper import Json
from .response_http import Bad_request, Internal_server_error, Not_found, Ok
from .models import Event, Entertainment_areas, Workshop, Commune, Event_type

@require_GET
def home(request):
    return Json({Ok("Test api rest"), list(User.objects.all().values())})


@require_GET
def map_all_events_list(request):
    #Devuelve vacio
    event_list = []
    events = Event.objects.filter(event_available = 1).values("id", "event_name", "event_coordinates_longitude",
    "event_coordinates_latitude")
    areas = Entertainment_areas.objects.filter(area_available = 1).values("id", "area_name",
    "area_coordinates_longitude", "area_coordinates_latitude")
    workshops = Workshop.objects.filter(workshop_available = 1).values("id", "workshop_name",
    "workshop_coordinates_longitude", "workshop_coordinates_latitude")
    try:
        event_list.append([row for row in events.values()])
    except:
        return Json(Internal_server_error("Error in event list"))
    try:
        event_list.append([row for row in areas.values()])
    except:
        return Json(Internal_server_error("Error in area list"))
    try:
        event_list.append([row for row in workshops.values()])
    except:
        return Json(Internal_server_error("Error in workshop list"))
    if len(event_list) <= 0:
        return Json(Not_found("Not data found"))
    return Json(event_list)

@require_GET
def event_details(request, type, id):
    response = []
    if(type == "event"):
        try:
            event = Event.objects.filter(pk = id).values("event_name", "event_address", "image_route", "event_coordinates_longitude",
            "event_coordinates_latitude", "event_quotas", "event_description", "event_start_date", "event_ended_date", "event_start_time",
            "event_ended_time", "event_available", "event_type", "event_commune", "one_stars", "two_stars", "three_stars", "four_stars",
            "five_stars")
            response = [row for row in event.values()]
            return Json(response)
        except:
            pass
    elif type == "workshop":
        try: 
            workshop = Workshop.objects.filter(pk = id).values("workshop_name", "workshop_address", "image_route", "workshop_coordinates_longitude",
                "workshop_coordinates_latitude", "workshop_quotas", "workshop_description", "workshop_days", "workshop_start_date",
                "workshop_ended_date", "workshop_start_time", "workshop_ended_time", "workshop_available", "workshop_type", "workshop_commune")
            response = [row for row in workshop.values()]
            return Json(response)
        except:
            pass
    elif type == "area":
        try:
            area = Entertainment_areas.objects.filter(pk = id).values("area_name", "area_address", "image_route", "area_coordinates_longitude",
                "area_coordinates_latitude", "area_description", "area_days", "area_available", "area_commune")
            response = [row for row in area.values()]
            return Json(response)
        except:
            pass