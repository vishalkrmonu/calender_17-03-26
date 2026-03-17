from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Attendance


# =========================
# 1 ADD EMPLOYEE
# =========================

@api_view(['POST'])
def add_user(request):

    username = request.data.get("username")

    if not username:
        return Response({"error": "Username required"}, status=400)

    user, created = User.objects.get_or_create(username=username)

    return Response({
        "message": "User added successfully",
        "username": user.username
    })


# =========================
# 2 GET ALL USERS
# =========================

@api_view(['GET'])
def get_users(request):

    users = User.objects.all()

    data = [
        {
            "id": u.id,
            "username": u.username
        }
        for u in users
    ]

    return Response(data)


# =========================
# 3 SUBMIT ATTENDANCE
# =========================

@api_view(['POST'])
def submit_attendance(request):

    records = request.data

    for item in records:

        username = item.get("username")
        date = item.get("date")
        status = item.get("status")

        Attendance.objects.update_or_create(
            username=username,
            date=date,
            defaults={
                "status": status,
                "deleted": 0
            }
        )

    return Response({"message": "Attendance saved successfully"})


# =========================
# 4 FETCH ATTENDANCE
# =========================

@api_view(['GET'])
def get_attendance(request):

    year = request.GET.get("year")
    month = request.GET.get("month")

    records = Attendance.objects.filter(
        date__year=year,
        date__month=month,
        deleted=0
    )

    result = {}

    for record in records:

        username = record.username
        day = record.date.day

        if username not in result:
            result[username] = {}

        result[username][day] = record.status

    return Response(result)