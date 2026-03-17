from django.urls import path
from .views import add_user, get_users, submit_attendance, get_attendance

urlpatterns = [

    path('add-user/', add_user),

    path('users/', get_users),

    path('attendance/submit/', submit_attendance),

    path('attendance/data/', get_attendance),

]