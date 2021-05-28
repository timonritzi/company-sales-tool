from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['username']

    RANG_CHOICES = [
        (10, '10'),(15, '15'),(20, '20'),(25, '25'),(30, '30'),(35, '35'),(40, '40'),(45, '45'),(50, '50'),(55, '55'),
        (60, '60'),(65, '65'),(70, '70'),(75, '75'),(80, '80'),(85, '85'),(90, '90'),(95, '95'),(100, '100')
    ]

    email = models.EmailField(unique=True)
    first_name = models.CharField(null=True, max_length=100, blank=True)
    last_name = models.CharField(null=True, max_length=100, blank=True)
    phone = models.CharField(null=True, blank=True, max_length=100)
    address = models.CharField(null=True, max_length=100, blank=True)
    about = models.TextField(null=True, max_length=2500, blank=True)
    avatar = models.ImageField(null=True, blank=True)
    location = models.CharField(null=True, max_length=100, blank=True)
    position = models.CharField(null=True, max_length=100, blank=True)
    salesman = models.BooleanField(default=False)
    status = models.BooleanField(default=False)
    rang = models.IntegerField(null=True, blank=True, choices=RANG_CHOICES)

    ort_choices = [
        ('AutoGraf-BMW', 'AutoGraf-BMW'),
        ('AutoGraf-MINI', 'AutoGraf-MINI'),
        ('AutoSteiner', 'AutoSteiner')
    ]
    autohaus = models.CharField(
        max_length=15,
        choices=ort_choices
    )




    def __str__(self):
        return self.username
