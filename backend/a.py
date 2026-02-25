

import os
import tempfile
from typing import List, Tuple, Union

from moviepy import (
    ImageClip,
    AudioFileClip,
    concatenate_videoclips,
)
from moviepy.audio.AudioClip import concatenate_audioclips  # <-- QUAN TRỌNG


def _synthesize_tts(
    text: str,
    out_path: str,
    engine: str = "gtts",
    lang: str = "vi",
):
    """Tạo file âm thanh từ văn bản (TIẾNG VIỆT)."""

    if engine == "gtts":
        from gtts import gTTS

        tts = gTTS(text=text, lang=lang)
        tts.save(out_path)
        return out_path
    else:
        raise ValueError("Chỉ dùng gtts cho bản này.")


def make_video_from_image_text_pairs(
    pairs: List[Tuple[Union[str, "np.ndarray"], str]],
    output_path: str,
    fps: int = 24,
    tts_engine: str = "gtts",
    lang: str = "vi",
    codec: str = "libx264",
    audio_codec: str = "aac",
):
    tmpdir = tempfile.mkdtemp(prefix="img_text_video_")
    audio_ext = ".mp3"

    clips = []
    audio_clips = []

    try:
        for idx, (image, text) in enumerate(pairs):

            # 1) Tạo audio
            audio_path = os.path.join(tmpdir, f"audio_{idx}{audio_ext}")
            _synthesize_tts(text, audio_path, engine=tts_engine, lang=lang)

            audio = AudioFileClip(audio_path)

            # 2) Tạo clip ảnh có cùng thời lượng với audio
            if isinstance(image, str):
                img_clip = ImageClip(image).with_duration(audio.duration)
            else:
                img_clip = ImageClip(image).with_duration(audio.duration)

            clips.append(img_clip)
            audio_clips.append(audio)

        # 3) Nối video (ảnh)
        video = concatenate_videoclips(clips, method="compose")

        # ✅ 4) NỐI AUDIO ĐÚNG CÁCH (đã sửa)
        full_audio = concatenate_audioclips(audio_clips)

        # 5) Gắn audio vào video
        video = video.with_audio(full_audio)

        # 6) Xuất file
        video.write_videofile(
            output_path,
            fps=fps,
            codec=codec,
            audio_codec=audio_codec,
            audio_bitrate="192k",
            logger="bar",
        )

        return output_path

    finally:
        for c in clips:
            try:
                c.close()
            except:
                pass

        for a in audio_clips:
            try:
                a.close()
            except:
                pass

        try:
            for f in os.listdir(tmpdir):
                os.remove(os.path.join(tmpdir, f))
            os.rmdir(tmpdir)
        except:
            pass


# ================= DEMO TEST =================
if __name__ == "__main__":
    import numpy as np

    red = np.zeros((720, 1280, 3), dtype=np.uint8)
    red[:, :, 0] = 255

    green = np.zeros((720, 1280, 3), dtype=np.uint8)
    green[:, :, 1] = 255

    demo_pairs = [
        (red, "Xin chào, đây là video tạo bằng Python."),
        (green, "MoviePy kết hợp với Google Text to Speech rất tiện lợi."),
    ]

    out = make_video_from_image_text_pairs(
        demo_pairs,
        output_path="output.mp4",
        tts_engine="gtts",
        lang="vi",
    )

    print("Video written:", out)
