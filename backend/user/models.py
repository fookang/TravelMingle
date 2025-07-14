from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

def user_avatar_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.username}_avatar.{ext}"
    return f"avatars/{filename}"

class User(AbstractUser):
    avatar = models.ImageField(
        upload_to=user_avatar_path, 
        blank=True, 
        null=True, 
        default='avatars/default.png',
        validators=[])
    
    email = models.EmailField(unique=True, 
        blank=False, 
        null=False)
    
    first_name = models.CharField(max_length=50, blank=False, null=False)
    
    last_name = models.CharField(max_length=50, blank=False,null=False)
    
    def save(self, *args, **kwargs):
        try:
            user = User.objects.get(id=self.id)
            if user.avatar != self.avatar and user.avatar != 'avatars/default.png':
                user.avatar.delete(save=False)
        except User.DoesNotExist:
            pass
        
        return super().save(*args, **kwargs)