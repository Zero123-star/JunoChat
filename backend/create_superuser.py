import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_MDS.settings')
django.setup()

from base.models import CustomUser

if not CustomUser.objects.filter(username='Juno').exists():
    CustomUser.objects.create_superuser(username='Juno', password='1234', email='juno@example.com')
    print("Superuser 'Juno' created.")
else:
    print("Superuser 'Juno' already exists.")
