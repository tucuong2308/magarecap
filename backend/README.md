# Image + Text-to-Speech to Video (MoviePy)

This script builds a video where each image is shown while the corresponding text is spoken. Uses MoviePy and a TTS engine (gTTS or pyttsx3).

## Requirements

- Python 3.9+
- FFmpeg installed and on PATH (MoviePy needs it)
- Packages from `requirements.txt`

### Install FFmpeg (Windows)

If you use Winget:

```bash
winget install --id=Gyan.FFmpeg -e
```

Or via Chocolatey:

```bash
choco install ffmpeg
```

Alternatively, download from https://www.gyan.dev/ffmpeg/ and add `bin` to PATH.

### Install Python packages

```bash
pip install -r requirements.txt
```

## Usage

Python API usage:

```python
from a import make_video_from_image_text_pairs

pairs = [
    ("path/to/image1.jpg", "Hello world"),
    ("path/to/image2.png", "This is slide two"),
]

make_video_from_image_text_pairs(
    pairs,
    output_path="output.mp4",
    tts_engine="gtts",  # or "pyttsx3" for offline
    lang="en",
)
```

Notes:

- `image` can be a file path or a NumPy RGB array.
- `gtts` requires internet and outputs MP3; `pyttsx3` is offline and outputs WAV.
- The clip duration automatically matches the speech duration.

## Demo

Run the demo (uses in-memory colored images):

```bash
python a.py
```

This will generate `output.mp4` in the working directory using pyttsx3.
