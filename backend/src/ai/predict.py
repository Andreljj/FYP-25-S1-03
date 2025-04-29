import sys
import json
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

# === Load models
category_model = load_model("src/ai/multi_output_model.h5")          # Category only
color_model = load_model("src/ai/color_classifier.h5")         # Color only
condition_model = load_model("src/ai/clothing_condition_model.h5")   # Condition only

# === Label lists
category_labels = ['bottom', 'footwear', 'top']
color_labels = ['black', 'blue', 'brown', 'green', 'grey', 'orange', 'pink', 'red', 'white', 'yellow']
condition_labels = ['good', 'poor', 'used']

# === Get image path from CLI argument
image_path = sys.argv[1]

# === Preprocess the image
def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB").resize((128, 128), Image.LANCZOS)
    img = img_to_array(img)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

image = preprocess_image(image_path)

# === Predict Category
category_preds = category_model.predict(image)[0]
category_probs = category_preds[:len(category_labels)]
pred_category_idx = np.argmax(category_probs)
category = category_labels[pred_category_idx]

# === Predict Color
color_preds = color_model.predict(image)[0]
pred_color_idx = np.argmax(color_preds)
color = color_labels[pred_color_idx]

# === Predict Condition
condition_preds = condition_model.predict(image)[0]
pred_condition_idx = np.argmax(condition_preds)
condition = condition_labels[pred_condition_idx]

# === Capitalize nicely (optional, so backend receive pretty words)
category = category.capitalize()
color = color.capitalize()
condition = condition.capitalize()

# === Output JSON
result = {
    "category": category,
    "color": color,
    "condition": condition
}
print(json.dumps(result))
