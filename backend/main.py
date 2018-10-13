from flask import Flask, jsonify, request
from speech_recognizer import convert_to_text
import json

app = Flask(__name__)
@app.route('/form')

@app.route('/live', methods=['POST'])
def process_batch():
    # data = json.loads(request.data)
    # audio = base64.b64decode(data.audio)
    # text, count_of_words = convert_to_text(audio)
    # return jsonify({"text": text, "count_of_words": count_of_words})
    return jsonify({"text": "test"})

@app.route('/end', methods=['GET'])
def end():
    return jsonify({"done": True})
