import os
import django

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_MDS.settings')

# Create the logs directory if it doesn't exist
os.makedirs('logs', exist_ok=True)

# Now it's safe to initialize Django
django.setup()

from api.models import Character
from api.models import CustomUser

# Get an existing user to use as creator
try:
    user = CustomUser.objects.first()
    if not user:
        print("No users in the database. Run 'python manage.py createsuperuser' first.")
        exit(1)
    print(f"Using user: {user.username}")
except Exception as e:
    print(f"Error getting user: {e}")
    exit(1)

# List of characters to add
characters = [
    {"name": "Naruto Uzumaki", "avatar": "avatars/naruto.webp", "source": "Naruto",
      "description": "A spirited and determined ninja from Konoha, dreaming of becoming Hokage. He's cheerful, "
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

# Add the characters
print("\n" + "="*60)
print("ADDING CHARACTERS TO DATABASE")
print("="*60 + "\n")

for char in characters:
    try:
        # Check if character already exists
        existing = Character.objects.filter(name=char["name"]).first()
        if existing:
            print(f"⚠️  Character '{char['name']}' already exists (ID: {existing.id})")
            continue
            
        character = Character.objects.create(
            name=char["name"],
            description=char["description"],
            avatar=char["avatar"],
            source=char["source"],
            creator=user
        )
        print(f"✅ Character created: {character.name} (ID: {character.id})")
    except Exception as e:
        print(f"❌ Error creating character '{char['name']}': {e}")

print("\n" + "="*60)
print("COMPLETED!")
print("="*60)
