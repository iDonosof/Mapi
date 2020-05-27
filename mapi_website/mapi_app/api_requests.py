# from django.contrib.auth import authenticate, login, logout
# from django.contrib.auth.decorators import login_required, user_passes_test
# from django.core.paginator import Paginator
from django.contrib.auth.models import User
from django.template.context_processors import request
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse
from django.conf import settings

from .helper import Json
from .response_http import Bad_request, Internal_server_error, Not_found, Ok
from .models import Event, Entertainment_areas, Workshop, Commune, Event_type, Workshop_type

@require_GET
def home(request):
    return Json({Ok("Test api rest"), list(User.objects.all().values())})


@require_GET
def map_all_events_list(request):
    event_list = []
    events = Event.objects.filter(event_available = 1).values("id", "event_name", "event_coordinates_longitude",
    "event_coordinates_latitude", "event_type")
    try:
        for event in events.values():
            event_list.append({
                "id": event["id"],
                "name": event["event_name"],
                "latitude": event["event_coordinates_latitude"],
                "longitude": event["event_coordinates_longitude"],
                "table": "event",
                "icon": Event_type.objects.get(pk = event["event_type_id"]).event_type_icon.url
            })
        event_list.append([row for row in events.values()])
    except:
        return Json(Internal_server_error("Error in event list"))
    areas = Entertainment_areas.objects.filter(area_available = 1).values("id", "area_name",
    "area_coordinates_longitude", "area_coordinates_latitude", "icon_route")
    try:
        for area in areas.values():
            event_list.append({
                "id": area["id"],
                "name": area["area_name"],
                "latitude": area["area_coordinates_latitude"],
                "longitude": area["area_coordinates_longitude"],
                "table": "area",
                "icon": "{0}{1}".format(settings.MEDIA_URL, area["icon_route"])
            })
    except:
        return Json(Internal_server_error("Error in area list"))

    workshops = Workshop.objects.filter(workshop_available = 1).values("id", "workshop_name",
    "workshop_coordinates_longitude", "workshop_coordinates_latitude", "workshop_type")
    try:
        for workshop in workshops.values():
            event_list.append({
                "id": workshop["id"],
                "name": workshop["workshop_name"],
                "latitude": workshop["workshop_coordinates_latitude"],
                "longitude": workshop["workshop_coordinates_longitude"],
                "table": "workshop",
                "icon": Workshop_type.objects.get(pk = workshop["workshop_type_id"]).workshop_type_icon.url
            })
    except:
        return Json(Internal_server_error("Error in workshop list"))
    if len(event_list) <= 0:
        return Json(Not_found("Not data found"))
    return Json(event_list)

@require_GET
def event_details(request, type, id):
    if(type == "event"):
        try:
            event_queryset = Event.objects.filter(pk = id).values("event_name", "event_address", "image_route", "event_coordinates_longitude",
            "event_coordinates_latitude", "event_quotas", "event_description", "event_start_date", "event_ended_date", "event_start_time",
            "event_ended_time", "event_available", "event_type", "event_commune", "one_stars", "two_stars", "three_stars", "four_stars",
            "five_stars")
            event = [row for row in event_queryset.values()][0]
            event["table"] = "event"
            event["image_route"] = "{0}{1}".format(settings.MEDIA_URL, event["image_route"])
            return Json(event)
        except:
            pass
    elif type == "workshop":
        try: 
            workshop_queryset = Workshop.objects.filter(pk = id).values("workshop_name", "workshop_address", "image_route", "workshop_coordinates_longitude",
                "workshop_coordinates_latitude", "workshop_quotas", "workshop_description", "workshop_days", "workshop_start_date",
                "workshop_ended_date", "workshop_start_time", "workshop_ended_time", "workshop_available", "workshop_type", "workshop_commune")
            workshop = [row for row in workshop_queryset.values()][0]
            workshop["table"] = "workshop"
            workshop["image_route"] = "{0}{1}".format(settings.MEDIA_URL, workshop["image_route"])
            return Json(workshop)
        except:
            pass
    elif type == "area":
        try:
            area_queryset = Entertainment_areas.objects.filter(pk = id).values("area_name", "area_address", "image_route", "area_coordinates_longitude",
                "area_coordinates_latitude", "area_description", "area_days", "area_available", "area_commune")
            area = [row for row in area_queryset.values()][0]
            area["table"] = "area"
            area["image_route"] = "{0}{1}".format(settings.MEDIA_URL, area["image_route"])
            return Json(area)
        except:
            pass
