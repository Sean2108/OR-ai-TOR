import speech_recognition as sr
from nltk.corpus import stopwords
# obtain path to "english.wav" in the same folder as this script
from os import path
r = sr.Recognizer()

def convert_to_text(audio_file):
    # AUDIO_FILE = path.join(path.dirname(path.realpath(__file__)), audio_file)
    with sr.AudioFile(audio_file) as source:
        audio = r.record(source)
        duration = source.DURATION
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
    return count_of_words