idea: 
.......
django api: 
   try:
        response = requests.post("https://llama2-flask-bot.azurewebsites.net/", json=payload)
        response.raise_for_status()
        return response.json().get("bot_reply")
    except Exception as e:
        print(f"Flask bot API error: {e}")
        return "Sorry, I couldn’t respond right now."
--> sends json to AZURE
.......
app.py 
=> communicates with AI API, gets json response
...then, we'd be returning json to django
