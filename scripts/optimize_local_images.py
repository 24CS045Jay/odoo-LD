from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1] / "client" / "public" / "assets" / "images"
MAX_EDGE = 1600
JPEG_QUALITY = 84


def optimize(path: Path) -> None:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        image.save(path, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)


for folder in (ROOT / "destinations", ROOT / "regions", ROOT / "activities", ROOT / "community", ROOT / "hero"):
    for image_path in folder.glob("*.jpg"):
        optimize(image_path)
        print(f"optimized {image_path.relative_to(ROOT)}")
