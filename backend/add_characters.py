import os
import django
import requests
# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_MDS.settings')

# Create the logs directory if it doesn't exist
# This must be done BEFORE django.setup()
os.makedirs('logs', exist_ok=True)

# Now it's safe to initialize Django
django.setup()
#print(123)
from base.models import Character
from base.models import CustomUser
from base.models import Chat
from base.models import Message
from api.views import ChatViewSet
uv=Chat.objects.all()
for i in uv:
    print(i.id)
uer=CustomUser.objects.get(email="email@rm.com")

#Posting to a function from chatviewset, get_chats that returns a json with all the chats of a user
# chat_view_set = ChatViewSet()
# json={'user_id': uer.id}

# username='test'
# email='email@email'
# password='123'



# user = CustomUser.objects.get(username=username)
# user.delete()
# print("User deleted:", username)
'''''
Creates a user
user = CustomUser.objects.create(
    username=username,
    email=email,
    password=password,  # Note: Password should be hashed in production
    is_superuser=False,
    first_name='',
    last_name='',
    is_staff=False,
    is_active=True,
    date_joined='2006-10-25',  # Automatically set by Django
    confirmed_email=False,  # Assuming you have a field for email confirmation
    blocked=False  # Assuming you have a field for blocking users
)
print("User created:", user.username)
###Delete the user
'''

#Delete all messages from a chat id 
''''
def delete_messages_from_chat(chat_id):
    messages = Message.objects.filter(chat_id=chat_id)
    for message in messages:
        message.delete()
    print(f"All messages from chat {chat_id} have been deleted.")
delete_messages_from_chat(chat_id=4)
'''''


'''''
print(message.description)
###Testing a function now...
def get_messages_list(chatid):
  messages = Message.objects.filter(chat_id=chatid).order_by('number')
  messages_list = []
  for message in messages:
    role = 'user' if message.sender_bot_id is None else 'assistant'
    messages_list.append({
    'role': role,
    'content': message.description
    })
  return messages_list
m=get_messages_list(chatid=4)
print(m)
'''


#    print("This message is sent by the bot"
#v=Chat.objects.create(
#    id=1,
#    chatbot_id=aux,
#    user_id=12
#    )
#print("gg")
# Obține un utilizator existent

#NOTE: Chat correctly increments id. TODO: Decrement last ids when deleting a chat, otherwise we will get an overflow at some point

name = "Bro"

def delete_character_by_name(name):
  try:
    character = Character.objects.get(name=name)
    character.delete()
    print(f"Character '{name}' has been deleted.")
  except Character.DoesNotExist:
    print(f"Character '{name}' does not exist.")

# Example usage
delete_character_by_name(name)

#print("check")
#print(chat_that_doest_exist.id)
##Delete the mock chat
#chat_that_doest_exist.delete()
#print("Successfully deleted the mock chat")

# user = uer
# user_id=user.id

# Listează personajele de adăugat
# characters = [
#     {"name": "Naruto Uzumaki", "avatar": "avatars/naruto.webp", "source": "Naruto",
#       "description": " A spirited and determined ninja from Konoha, dreaming of becoming Hokage. He’s cheerful, "
#       "bold, and carries the power of the Nine-Tails within him."},
#     {"name": "Sasuke Uchiha", "avatar": "avatars/sasuke.jpg", "source": "Naruto", 
#       "description": "A skilled and brooding ninja from the Uchiha clan, seeking revenge for his family's massacre. "
#       "He is Naruto's rival and friend."},
#     {"name": "Scooby-Doo", "avatar": "avatars/Scooby-Doo.png", "source": "Scooby-Doo", 
#      "description": "A goofy, cowardly, yet loyal Great Dane who solves mysteries with his friends. He loves Shaggy and snacks, especially Scooby Snacks."},
#     {"name": "Johnny Bravo", "avatar": "avatars/JohnnyBravo.jpeg", "source": "Johnny Bravo", 
#      "description": "A cocky, dim-witted ladies' man with slick blond hair and overconfidence in his charm. His attempts to flirt always end in hilarious rejection."},
#     {"name": "Baloo the Bear", "avatar": "avatars/baloo-the-bear.webp", "source": "The Jungle Book", 
#      "description": "A laid-back, fun-loving bear from 'The Jungle Book'. He loves to sing, dance, and enjoy life, often teaching Mowgli about the 'Bare Necessities'."},
#     {"name": "Hisoka", "avatar": "avatars/hisoka.jpg", "source": "Hunter x Hunter", 
#      "description": "A flamboyant and unpredictable magician. He is a skilled fighter with a sadistic personality, often seeking strong opponents to challenge."},
# ]

# # Adaugă personajele
# for char in characters:
#     character = Character.objects.create(
#         name=char["name"],
#         description=char["description"],
#         avatar=char["avatar"],
#         source=char["source"],
#         creator=user
#     )
#     print(f'Personaj creat: {character.name}')
