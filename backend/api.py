from google import genai
import PIL.Image

client = genai.Client(api_key='')

# Build an array `a` with one string and images page_1.jpg to page_10.jpg
image_paths = [f"image/page_{i}.jpg" for i in range(1, 11)]
images = [PIL.Image.open(p) for p in image_paths]
a = ["lồng tiếng cho các ảnh sau "] + images

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents=a,
)

print(response.text)