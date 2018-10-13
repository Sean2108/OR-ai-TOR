import speech_recognition as sr
from nltk.corpus import stopwords
# obtain path to "english.wav" in the same folder as this script
from os import path
r = sr.Recognizer()

def convert_to_text():
    AUDIO_FILE = path.join(path.dirname(path.realpath(__file__)), "OSR_us_000_0010_8k.wav")
    with sr.AudioFile(AUDIO_FILE) as source:
        audio = r.record(source)  # read the entire audio file
    # recognize speech using Sphinx
    try:
        text = r.recognize_google(audio)
        return text, count_words(text)
    except sr.UnknownValueError:
        return "Sphinx could not understand audio", None
    except sr.RequestError as e:
        return "Sphinx error; {0}".format(e), None

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