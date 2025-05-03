import requests

url = "http://127.0.0.1:5001/generate"
data = {"prompt": "Salut AI"}


response = requests.post(url, json=data)
print(response.json())

# so from django I get JSON data, i send post to my API
# terminal: source venv/bin/activate (activate virtual env)
# python3 client.py // i run this to send my request (all this after) i 
# activate API, so in another window




