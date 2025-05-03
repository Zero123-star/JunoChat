from flask import Flask, request, jsonify

app = Flask(__name__)

# Ruta principală pentru browser (GET pe "/")
@app.route('/', methods=['GET'])
def index():
    return '''
    <h1>Serverul Flask este pornit!</h1>
    <p>Trimite un POST la <code>/generate</code> cu un JSON de forma {"prompt": "textul tau"}.</p>
    '''

# Ruta API pentru generarea răspunsului (POST pe "/generate")
@app.route('/generate', methods=['POST'])
def generate_response():
    data = request.get_json()
    prompt = data.get('prompt', '')
    
    # Dummy AI reply: inversăm stringul (poți pune aici orice model AI real ulterior)
    reply = f"AI says: {prompt[::-1]}"
    
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(port=5001)
    
# terminal: flask run --port=5001 (i activate API)

