import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Embedding
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
import json

# Load the dataset
with open('dataset.json', 'r') as f:
    dataset = json.load(f)

questions = [item['question'] for item in dataset]
answers = [item['answer'] for item in dataset]

# Tokenize the questions and answers
tokenizer = Tokenizer()
tokenizer.fit_on_texts(questions + answers)

vocab_size = len(tokenizer.word_index) + 1

# Convert texts to sequences
questions_seq = tokenizer.texts_to_sequences(questions)
answers_seq = tokenizer.texts_to_sequences(answers)

# Pad sequences
max_length = max(max(len(seq) for seq in questions_seq), max(len(seq) for seq in answers_seq))
questions_seq = pad_sequences(questions_seq, maxlen=max_length, padding='post')
answers_seq = pad_sequences(answers_seq, maxlen=max_length, padding='post')

# Define the model
model = Sequential([
    Embedding(vocab_size, 128, input_length=max_length),
    LSTM(128, return_sequences=True),
    LSTM(128),
    Dense(128, activation='relu'),
    Dense(vocab_size, activation='softmax')
])

# Compile the model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(questions_seq, np.array(answers_seq), epochs=10, batch_size=32)

# Save the model
model.save('model.h5')

# Save the tokenizer
with open('tokenizer.json', 'w') as f:
    json.dump(tokenizer.to_json(), f)
