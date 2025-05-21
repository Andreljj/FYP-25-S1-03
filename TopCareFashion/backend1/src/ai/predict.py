import sys
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

script_dir = os.path.dirname(os.path.abspath(__file__))

# Load models
multi_output_model = load_model(os.path.join(script_dir, 'multi_output_model.h5'))  # Predicts category and color
condition_model = load_model(os.path.join(script_dir, 'clothing_condition_model.h5')) 

# Label encodings from training
category_labels = ['bottom', 'footwear', 'top']
color_labels = ['black', 'blue', 'brown', 'green', 'pink', 'red', 'silver', 'white', 'yellow']
condition_labels = ['good', 'poor', 'used']

# Capitalization helper
def capitalize_label(label):
    return label.title()  # Converts "like new" → "Like New"

# Image preprocessing
IMG_SIZE = 128  # Make sure this matches your model input
def preprocess_image(img_path):
    img = load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

# Prediction function
def predict(img_path):
    img_array = preprocess_image(img_path)

    # Predict category and color
    pred_category, pred_color = multi_output_model.predict(img_array)
    category = capitalize_label(category_labels[np.argmax(pred_category)])
    color = capitalize_label(color_labels[np.argmax(pred_color)])

    # Predict condition
    pred_condition = condition_model.predict(img_array)
    condition = capitalize_label(condition_labels[np.argmax(pred_condition)])

    # Output results
    print(f"Predicted Category: {category}")
    print(f"Predicted Color: {color}")
    print(f"Predicted Condition: {condition}")

# Entry point
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
    else:
        predict(sys.argv[1])
