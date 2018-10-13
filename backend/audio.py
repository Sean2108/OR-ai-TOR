import librosa
y, sr = librosa.load("OSR_us_000_0010_8k.wav")
tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)

print('Estimated tempo: {:.2f} beats per minute'.format(tempo))
beat_times = librosa.frames_to_time(beat_frames, sr=sr)

# print('Saving output to beat_times.csv')
# librosa.output.times_csv('beat_times.csv', beat_times)

pitchtrack = librosa.core.piptrack(y=y, sr=sr)
print(librosa.core.pitch_tuning(pitchtrack))

y, sr = librosa.load("good_speakers/bush_prudent1.wav")

from matplotlib import pyplot as plt
import numpy as np
%matplotlib inline

D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)

from librosa import display
display.specshow(D, x_axis='time', y_axis='linear')

C = librosa.feature.chroma_cqt(y=y, sr=sr)
display.specshow(C, x_axis='time', y_axis='chroma')

pitchtrack = librosa.core.piptrack(y=y, sr=sr)
# pitchtrack
librosa.decompose.decompose(C)[1].shape

from tensorflow import keras

def convert_to_db(filename, offset):
    y, sr = librosa.load(filename, duration=5)
    return librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)

def read_file(filename, good):
    return [(convert_to_db(filename, offset), good) for offset in range(0, int(librosa.core.get_duration(filename=filename)), 5)]

# f = read_file("OSR_us_000_0010_8k.wav", False)

import os
def read_dir(directory, good, inputs):
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        inputs += read_file(os.path.join(directory, filename), good)

# m = read_file("OSR_us_000_0030_8k.wav", True)
inputs = []
read_dir("good_speakers", True, inputs)

inputs += read_file("OSR_us_000_0010_8k.wav", False)

from keras.models import Sequential

model = Sequential()
from keras.layers import Conv1D, Dense, MaxPool1D, Dropout

model.add(Conv1D(filters=32, kernel_size=(10), activation='relu'))
model.add(Conv1D(filters=64, kernel_size=(10), activation='relu'))
model.add(MaxPool1D(pool_size=4))
model.add(Flatten())
model.add(Dropout(0.25))
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(2, activation='softmax'))

model.compile(loss='categorical_crossentropy',
              optimizer='sgd',
              metrics=['accuracy'])

# inputs = f + m
np.asarray([input[0] for input in inputs]).shape

keras.utils.to_categorical(np.asarray([input[1] for input in inputs]))

model.fit(np.asarray([input[0] for input in inputs]), 
          keras.utils.to_categorical(np.asarray([input[1] for input in inputs])), epochs=10, batch_size=5)

test_set = read_file("OSR_us_000_0030_8k.wav", True)
np.asarray(test_set).shape

model.predict(np.asarray([input[0] for input in test_set]))