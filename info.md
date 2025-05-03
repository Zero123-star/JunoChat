idea: 
.......
django api: 
   try:
        response = requests.post("https://llama2-flask-bot.azurewebsites.net/", json=payload)
--> sends json to AZURE
.......
app.py 
=> communicates with AI API, gets json response
...then, we'd be returning json to django

My Azure endpoint site: https://llama2-flask-bot.azurewebsites.net/
Hugging face AI model API key: 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
