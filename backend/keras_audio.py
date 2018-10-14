
# coding: utf-8

# In[27]:


import librosa
#import ffmpeg
y, sr = librosa.load("good_speakers/bush_prudent1.wav")


# In[28]:


from matplotlib import pyplot as plt
import numpy as np
get_ipython().run_line_magic('matplotlib', 'inline')
plt.rcParams['figure.figsize'] = (17, 5)


# In[29]:


# D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
def create_mel(y, sr):
    D = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=256)
    return librosa.power_to_db(D, ref=np.max)

def create_mfcc(y, sr):
    D = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=256)
    mfcc = librosa.feature.mfcc(S=D, n_mfcc=13)
    return librosa.feature.delta(mfcc, order=2)

def get_pitch(y, sr):
    onset_envelope = librosa.onset.onset_strength(y=y, sr=sr, hop_length=256)
    N = len(y)
    T = N / float(sr)
    t = np.linspace(0, T, len(onset_envelope))
    onset_frames = librosa.util.peak_pick(onset_envelope, 10, 10, 10, 10, 0.5, 10)
    return onset_frames, [onset_envelope[i] for i in onset_frames]

def get_volume(y, sr):
    rmse = librosa.feature.rmse(y=y)[0]
    return librosa.util.peak_pick(np.asarray([100 * r for r in rmse]), 10, 10, 10, 10, 0.5, 10).tolist()

def get_tempo(y, sr):
    onset_envelope = librosa.onset.onset_strength(y=y, sr=sr, hop_length=256)
    tempo = librosa.beat.tempo(onset_envelope=onset_envelope, sr=sr, aggregate=None)
    tempo.shape
    filtered_tempo = []
    for i, num in enumerate(tempo):
        if i % 64 == 0:
            filtered_tempo.append(num)
    return filtered_tempo


# In[30]:


from librosa import display
display.waveplot(y=y, sr=sr)


# In[31]:


onset_envelope = librosa.onset.onset_strength(y=y, sr=sr, hop_length=256)
N = len(y)
T = N / float(sr)
t = np.linspace(0, T, len(onset_envelope))
print(onset_envelope.shape)
plt.plot(t, onset_envelope)


# In[32]:


onset_frames = librosa.util.peak_pick(onset_envelope, 15, 15, 15, 15, 0.5, 10)
onset_frames
# [onset_envelope[i] for i in onset_frames]


# In[33]:


rmse = librosa.feature.rmse(y=y)[0]
frames = range(len(rmse))
t = librosa.frames_to_time(frames, sr=sr)
plt.plot(t, rmse)
rmse_out = librosa.util.peak_pick(np.asarray([100 * r for r in rmse]), 15, 15, 15, 15, 0.5, 10)
rmse_out


# In[34]:


from librosa import display

mel = create_mel(y, sr)
display.specshow(mel, sr=sr, x_axis='time', y_axis='mel')


# In[35]:


mfcc = create_mfcc(y, sr)
display.specshow(mfcc, sr=sr, x_axis='time', y_axis='mel')


# In[36]:


C = librosa.feature.chroma_cqt(y=y, sr=sr)
display.specshow(C, x_axis='time', y_axis='chroma')


# In[37]:


pitchtrack = librosa.core.piptrack(y=y, sr=sr)
# pitchtrack
librosa.decompose.decompose(C)[1].shape
mel


# In[38]:


from tensorflow import keras


# In[109]:


def convert_to_db(filename, offset):
    y, sr = librosa.load(filename, duration=5)
#     return librosa.feature.melspectrogram(y)
#     return librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
    return create_mel(y, sr)

def get_stuff(filename, offset):
    y, sr = librosa.load(filename, offset=offset, duration=5)
#     print(len(get_pitch(y, sr)[1]), len(get_volume(y, sr)), len(get_tempo(y, sr)))
    tempo = get_tempo(y, sr)
    pitch = pad(get_pitch(y, sr)[1], tempo)
    volume = pad(get_volume(y, sr), tempo)
#     print(len(pitch), len(volume), len(tempo))
    return (pitch, volume, tempo)

def pad(arr, tempo):
    if not arr:
        return [0 for _ in range(len(tempo))]
    if len(arr) > len(tempo):
        return arr[:len(tempo)]
    if len(arr) < len(tempo):
        avg = sum(arr) / len(arr)
        return arr + [avg for _ in range(len(tempo) - len(arr))]
    return arr

def read_file(filename, good):
#     return [(convert_to_db(filename, offset), good) for offset in range(0, int(librosa.core.get_duration(filename=filename)), 5)]
    return [(get_stuff(filename, offset), good) for offset in range(0, int(librosa.core.get_duration(filename=filename)-5), 5)]


# In[110]:


# f = read_file("OSR_us_000_0010_8k.wav", False)

from os import listdir, fsdecode, path

def read_dir(directory, good, inputs):
    for file in listdir(directory):
        filename = fsdecode(file)
        inputs += read_file(path.join(directory, filename), good)


# In[111]:


# m = read_file("OSR_us_000_0030_8k.wav", True)
inputs = []
read_dir("good_speakers", True, inputs)


# In[112]:


inputs += read_file("OSR_us_000_0010_8k.wav", False)


# In[113]:


from tensorflow import keras
from keras.models import Sequential

model = Sequential()
from keras.layers import Conv1D, Dense, MaxPool1D, Dropout, Flatten, GlobalAveragePooling1D

model.add(Conv1D(filters=32, kernel_size=(4), activation='relu', padding='same'))
model.add(Conv1D(filters=64, kernel_size=(4), activation='relu', padding='same'))
model.add(MaxPool1D(pool_size=2))
model.add(Flatten())
model.add(Dropout(0.25))
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(2, activation='softmax'))


# In[114]:


model.compile(loss='categorical_crossentropy',
              optimizer='sgd',
              metrics=['accuracy'])


# In[115]:


# inputs = f + m
np.asarray([np.asarray(input[0]) for input in inputs]).shape


# In[116]:


keras.utils.to_categorical(np.asarray([input[1] for input in inputs])).shape


# In[120]:


actual = model.fit(np.asarray([input[0] for input in inputs]), keras.utils.to_categorical(np.asarray([input[1] for input in inputs])), epochs=10, batch_size=5)
#predict_proba(model, y, batch_size = NULL, verbose = 0, steps = NULL)
def predict_classes(model, x, batch_size=32, verbose=1):
    proba = model.predict(x, batch_size=batch_size, verbose=verbose, steps=None)
    return proba
#     if proba.shape[-1] > 1:
#         return proba
#     else:
#         return (proba > 0.5).astype('int32')


# In[121]:


rmse_out.shape


# In[130]:


# onset_frames = np.reshape(onset_frames, (onset_frames[0], 1, onset_frames[1]))
# predict_loudness = predict_classes(model, rmse_out.reshape())
# predict_tempo = predict_classes(model, np.asarray([np.asarray(input[0][1]) for input in inputs]))
# predict_pitch = predict_classes(model, onset_frames)
sub = [input[0] for input in read_file("OSR_us_000_0010_8k.wav", False)][0]
print(sub)
predict_classes(model, np.asarray([np.asarray(sub)]))


# In[ ]:


test_set = read_file("OSR_us_000_0030_8k.wav", True)
#np.asarray(test_set).shape


# In[ ]:


model.predict(np.asarray([input[0] for input in test_set]))

