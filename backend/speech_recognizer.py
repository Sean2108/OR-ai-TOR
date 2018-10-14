import speech_recognition as sr
from nltk.corpus import stopwords
# obtain path to "english.wav" in the same folder as this script
from os import path
from keras_audio import load_existing_model, read_file
import numpy as np
r = sr.Recognizer()
model = load_existing_model()

def convert_to_text(audio_file):
    # AUDIO_FILE = path.join(path.dirname(path.realpath(__file__)), audio_file)
    with sr.AudioFile(audio_file) as source:
        audio = r.record(source)
        duration = source.DURATION

    test_set = read_file(audio_file, True)
    if test_set:
        bad, good = model.predict(np.asarray([input[0] for input in test_set]))
        if good:
            return 'Good job!', None, None
    try:
        text = r.recognize_google(audio)
        return text, count_words(text), len(text.split(' ')) * 60 / duration
    except sr.UnknownValueError:
        return "Sphinx could not understand audio", None, None
    except sr.RequestError as e:
        return "Sphinx error; {0}".format(e), None, None

def count_words(text):
    count_of_words = {}
    stopwords_set = set(stopwords.words('english'))
    for word in [w.lower() for w in text.split(' ')]:
        if word not in stopwords_set:
            continue
        if word not in count_of_words:
            count_of_words[word] = 0
        count_of_words[word] += 1
    return sorted([(word, count_of_words[word]) for word in count_of_words], key=lambda x: x[1], reverse=True)