"""Cut 2x2 Gemini contact sheets into single uniform product tiles.
usage: python3 cut_grids.py <in_dir> <out_dir> <map.json>
map.json: {"filename.png": "id1,id2,id3,id4", ...}  (order TL,TR,BL,BR; '-' or missing = skip)
Output: <out_dir>/<id>.webp, 640x640, backdrop normalised to one warm grey.
"""
import sys, json, os
import numpy as np
from PIL import Image

BG = np.array([226, 223, 216], dtype=np.float32)  # target warm grey
SIZE = 640

def gap_lines(a, axis):
    # mean brightness per row/col; gaps are the brightest thin lines near the middle
    prof = a.mean(axis=(1 - axis, 2)) if a.ndim == 3 else a.mean(axis=1 - axis)
    n = len(prof); lo, hi = int(n * 0.4), int(n * 0.6)
    mid = prof[lo:hi]
    thr = mid.max() - 6
    idx = np.where(mid >= thr)[0] + lo
    if len(idx) == 0 or (idx.max() - idx.min()) > n * 0.05:
        return n // 2, n // 2
    return int(idx.min()), int(idx.max()) + 1

def panels(img):
    a = np.asarray(img.convert('RGB')).astype(np.float32)
    h, w, _ = a.shape
    y0, y1 = gap_lines(a, 0)
    x0, x1 = gap_lines(a, 1)
    boxes = [(0, 0, x0, y0), (x1, 0, w, y0), (0, y1, x0, h), (x1, y1, w, h)]
    out = []
    for (l, t, r, b) in boxes:
        p = img.crop((l, t, r, b)).convert('RGB')
        # trim rounded outer corners by insetting 2%
        pw, ph = p.size; m = int(min(pw, ph) * 0.02)
        p = p.crop((m, m, pw - m, ph - m))
        s = min(p.size)
        p = p.crop(((p.width - s) // 2, (p.height - s) // 2, (p.width - s) // 2 + s, (p.height - s) // 2 + s))
        out.append(p)
    return out

def normalise(p):
    a = np.asarray(p).astype(np.float32)
    border = np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)])
    cur = np.median(border, axis=0)
    a = np.clip(a * (BG / np.maximum(cur, 1)), 0, 255)
    return Image.fromarray(a.astype(np.uint8)).resize((SIZE, SIZE), Image.LANCZOS)

if __name__ == '__main__':
    src, dst, mp = sys.argv[1:4]
    os.makedirs(dst, exist_ok=True)
    m = json.load(open(mp))
    for fn, ids in m.items():
        ids = ids.split(',')
        for pid, p in zip(ids, panels(Image.open(os.path.join(src, fn)))):
            if pid and pid != '-':
                normalise(p).save(os.path.join(dst, pid + '.webp'), quality=86)
                print('ok', pid)
