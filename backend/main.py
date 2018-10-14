from flask import Flask, jsonify, request
from speech_recognizer import convert_to_text
import json
import base64
import ffmpy
import os

app = Flask(__name__)

@app.route('/live', methods=['POST'])
def process_batch():
    audio = base64.b64decode(request.data.decode("utf-8"))
    if os.path.exists("audio.wav"):
        os.remove("audio.wav")
    with open('audio.m4a', 'wb') as fp:
        fp.write(audio)
    ff = ffmpy.FFmpeg(inputs={'audio.m4a': None}, outputs={'audio.wav': None})
    ff.run()
    text, count_of_words, pace = convert_to_text('audio.wav')
    return jsonify({"text": text, "count_of_words": count_of_words, "pace": pace})
    # return jsonify({"text": "test"})

@app.route('/end', methods=['GET'])
def end():
    return jsonify({"done": True})
