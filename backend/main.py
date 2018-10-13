from flask import Flask, jsonify, request
from speech_recognizer import convert_to_text
app = Flask(__name__)
@app.route('/form')

@app.route('/live', methods=['POST'])
def process_batch():
    text, count_of_words = convert_to_text()
    return jsonify({"text": text, "count_of_words": count_of_words})

@app.route('/end', methods=['GET'])
def end():
    return jsonify({"done": True})
