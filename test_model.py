from tensorflow.keras.models import Sequential, load_model
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import tensorflow as tf
import numpy as np
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1'

le: LabelEncoder = joblib.load('assets/label_encoder.joblib')
model: Sequential = load_model('assets/neural_network.h5')
tfidf_vectorizer: TfidfVectorizer = joblib.load('assets/nn_vectorizer.joblib')

input_message = 'I am available for the appointment at this date'

analysis = le.inverse_transform(tf.math.argmax(model
                                            .predict(tfidf_vectorizer
                                                     .transform(np.array([input_message])).toarray()), axis=1))[0]
print('Model\'s analysis of the message:', analysis)