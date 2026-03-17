from django.db import models


class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    deleted = models.IntegerField(default=0)

    def __str__(self):
        return self.username


class Attendance(models.Model):
    username = models.CharField(max_length=100)
    date = models.DateField()
    status = models.CharField(max_length=50)
    deleted = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.username} - {self.date}"