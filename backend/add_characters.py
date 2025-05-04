import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_MDS.settings')
django.setup()

from base.models import Character
from base.models import CustomUser

# Obține un utilizator existent
user = CustomUser.objects.get(username='Mary_Jane')

# Listează personajele de adăugat
characters = [
    {"name": "Naruto Uzumaki", "avatar": "avatars/naruto.webp", "source": "Naruto",
      "description": " A spirited and determined ninja from Konoha, dreaming of becoming Hokage. He’s cheerful, "
      "bold, and carries the power of the Nine-Tails within him."},
    {"name": "Sasuke Uchiha", "avatar": "avatars/sasuke.jpg", "source": "Naruto", 
      "description": "A skilled and brooding ninja from the Uchiha clan, seeking revenge for his family's massacre. "
      "He is Naruto's rival and friend."},
    {"name": "Scooby-Doo", "avatar": "avatars/Scooby-Doo.png", "source": "Scooby-Doo", 
     "description": "A goofy, cowardly, yet loyal Great Dane who solves mysteries with his friends. He loves Shaggy and snacks, especially Scooby Snacks."},
    {"name": "Johnny Bravo", "avatar": "avatars/JohnnyBravo.jpeg", "source": "Johnny Bravo", 
     "description": "A cocky, dim-witted ladies' man with slick blond hair and overconfidence in his charm. His attempts to flirt always end in hilarious rejection."},
    {"name": "Baloo the Bear", "avatar": "avatars/baloo-the-bear.webp", "source": "The Jungle Book", 
     "description": "A laid-back, fun-loving bear from 'The Jungle Book'. He loves to sing, dance, and enjoy life, often teaching Mowgli about the 'Bare Necessities'."},
    {"name": "Hisoka", "avatar": "avatars/hisoka.jpg", "source": "Hunter x Hunter", 
     "description": "A flamboyant and unpredictable magician. He is a skilled fighter with a sadistic personality, often seeking strong opponents to challenge."},
]

# Adaugă personajele
for char in characters:
    character = Character.objects.create(
        name=char["name"],
        description=char["description"],
        avatar=char["avatar"],
        source=char["source"],
        creator=user
    )
    print(f'Personaj creat: {character.name}')