from inference_sdk import InferenceHTTPClient
import os
from PIL import Image
from supervision import Detections, BoundingBoxAnnotator, LabelAnnotator
import brain

PATH = "/home/user/bot-test/function/tools/poker_detection"

try:
    if os.path.exists(f'{PATH}/result.jpg'):
        os.remove(f'{PATH}/result.jpg')
except FileNotFoundError:
    print("Error: The file 'image.png' was not found.")
    exit(1)

# 打開並保存圖像
try:
    if os.path.exists("f{PATH}/image.png"):
        im = Image.open("f{PATH}/image.png")
        os.remove(f'{PATH}/image.png')
        im.save("f{PATH}/image.jpg")
except FileNotFoundError:
    print("Error: The file 'image.png' was not found.")
    exit(1)

# 初始化 InferenceHTTPClient
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="ycKMJxlr6MvOLFVwbEfN"
)
# 推斷
try:
    result = CLIENT.infer(f'{PATH}/image.jpg', model_id="cards-and-such/1")
except Exception as e:
    print(f"Error during inference: {e}")
    exit(1)

# 從推斷結果中創建 Detections 對象
try:
    detections = Detections.from_inference(result)
except KeyError:
    print("Error: 'predictions' key not found in the inference result.")
    exit(1)

# 創建標註器
bounding_box_annotator = BoundingBoxAnnotator()
width, height = im.size
ratio = min(width / 640, height / 480)

label_annotator = LabelAnnotator(text_thickness=int(1.5 * ratio), text_scale=ratio)

# 獲取標籤
labels = [p['class'] for p in result.get('predictions', [])]

# 標註圖像
try:
    annotated_image = bounding_box_annotator.annotate(scene=im, detections=detections)
    annotated_image = label_annotator.annotate(scene=annotated_image, detections=detections, labels=labels)
except Exception as e:
    print(f"Error during annotation: {e}")
    exit(1)

# 保存標註後的圖像
try:
    os.remove("f{PATH}/image.jpg")
    annotated_image.save("f{PATH}/result.jpg")
except Exception as e:
    print(f"Error saving the annotated image: {e}")
    exit(1)

# 21點決策
cards = set(labels) # 避免重複牌
if len(cards) > 2:
    brain.decide(list(cards))

# 打印結果
print(labels)

