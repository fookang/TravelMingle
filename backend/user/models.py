from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    avatar = models.ImageField(
        upload_to='avatars/', 
        blank=True, 
        null=True, 
        default='avatars/default.png')
    
    email = models.EmailField(unique=True, 
        blank=False, 
        null=False)
    
    first_name = models.CharField(max_length=50, blank=False, null=False)
    
    last_name = models.CharField(max_length=50, blank=False,null=False)