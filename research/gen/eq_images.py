"""Turn accepted Gemini equipment images into uniform app images.
usage: python3 eq_images.py <in_dir> [<out_dir>=public/img/eq]
Reads ajt_eq_<id>.png (or .jpg/.webp). For each one:
  1. clears the Gemini sparkle watermark in the bottom-right corner,
  2. sets the backdrop to the same warm grey (#E2DFD8),
  3. frames the equipment the same way (object fills ~84% of the longer side, centred, a little lower than centre so the floor shadow sits naturally),
  4. writes <out_dir>/<id>.webp at 640x640.
Then run build_equip.py so the app knows which images exist.
"""
import sys, os, re
import numpy as np
from PIL import Image, ImageFilter

BG = np.array([226, 223, 216], dtype=np.float32)
SIZE, FILL = 640, 0.84
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def border_colour(a):
    b = np.concatenate([a[:10].reshape(-1, 3), a[-10:].reshape(-1, 3), a[:, :10].reshape(-1, 3), a[:, -10:].reshape(-1, 3)])
    return np.median(b, axis=0)

def clear_watermark(a):
    # Gemini puts a small sparkle about 2-6% in from the bottom-right corner. Paint that box with the backdrop
    # around it, but only if the box is otherwise backdrop (so we never paint over the equipment).
    h, w, _ = a.shape
    s = int(min(h, w) * 0.09)
    box = a[h - s:, w - s:]
    ring = np.concatenate([a[h - s - 12:h - s, w - s:].reshape(-1, 3), a[h - s:, w - s - 12:w - s].reshape(-1, 3)])
    ref = np.median(ring, axis=0)
    diff = np.abs(box - ref).max(axis=2)
    if (diff > 40).mean() < 0.12:  # mostly backdrop with a small mark
        yy = np.linspace(0, 1, s)[:, None, None]
        a[h - s:, w - s:] = ref * (1 - 0.0 * yy)
    return a

def bbox(a):
    d = np.abs(a - BG).max(axis=2)
    m = d > 26
    # ignore isolated specks
    rows, cols = np.where(m.sum(axis=1) > 3)[0], np.where(m.sum(axis=0) > 3)[0]
    if len(rows) == 0: return 0, 0, a.shape[1], a.shape[0]
    return cols.min(), rows.min(), cols.max() + 1, rows.max() + 1

def process(path):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    a = clear_watermark(a)
    a = np.clip(a * (BG / np.maximum(border_colour(a), 1)), 0, 255)
    l, t, r, b = bbox(a)
    w, h = r - l, b - t
    H, W = a.shape[:2]
    # crop a square from the photo itself; never pad onto a bigger canvas (a pasted photo shows as a box when the backdrop is shaded)
    side = min(max(w, h) / FILL, W, H)
    cx, cy = (l + r) / 2, (t + b) / 2 + side * 0.02
    x0 = int(round(min(max(cx - side / 2, 0), W - side))); y0 = int(round(min(max(cy - side / 2, 0), H - side)))
    src = Image.fromarray(a.astype(np.uint8))
    return src.crop((x0, y0, x0 + int(side), y0 + int(side))).resize((SIZE, SIZE), Image.LANCZOS)

if __name__ == "__main__":
    src = sys.argv[1]
    dst = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, "public", "img", "eq")
    os.makedirs(dst, exist_ok=True)
    for fn in sorted(os.listdir(src)):
        m = re.match(r"ajt_eq_(\w+)\.(png|jpe?g|webp)$", fn)
        if not m: continue
        out = process(os.path.join(src, fn))
        out.save(os.path.join(dst, m.group(1) + ".webp"), quality=86, method=6)
        print("ok", m.group(1))
