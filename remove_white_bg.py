"""Make the white background around each icon transparent.

Run it from inside your portfolio folder:

    python3 remove_white_bg.py

It only removes white that is connected to the edge of the image, so white
*inside* an icon (the page, the speech bubble) is left alone. Running it twice
is safe. It overwrites the PNGs in icons/, so if you ever want the originals
back, run:  git checkout icons
"""
import glob
import os
import sys
from collections import deque

from PIL import Image

THRESHOLD = 240  # a pixel counts as "white" if R, G and B are all at least this

# The gap between the briefcase handle and its body is enclosed by the outline,
# so the edge fill can't reach it. Start an extra fill there (32x32 icon only).
EXTRA_SEEDS = {"experience.png": [(13, 6)]}


def is_background(pixel):
    r, g, b, a = pixel
    return a == 0 or (r >= THRESHOLD and g >= THRESHOLD and b >= THRESHOLD)


def clear_outer_white(im, extra_seeds=()):
    """Flood-fill from the border and make connected white pixels transparent."""
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    seen = set()
    queue = deque()

    # Start from every pixel on the border of the image.
    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))
    if (w, h) == (32, 32):
        queue.extend(extra_seeds)

    while queue:
        x, y = queue.popleft()
        if not (0 <= x < w and 0 <= y < h) or (x, y) in seen:
            continue
        seen.add((x, y))
        if not is_background(px[x, y]):
            continue
        px[x, y] = (0, 0, 0, 0)
        # 4-directional (not diagonal) so the fill can't sneak through
        # the 1-pixel diagonal outlines of the icons.
        queue.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    return im


def count_transparent(im):
    px = im.convert("RGBA").load()
    w, h = im.size
    return sum(1 for y in range(h) for x in range(w) if px[x, y][3] == 0)


if __name__ == "__main__":
    folder = sys.argv[1] if len(sys.argv) > 1 else "icons"
    files = sorted(glob.glob(os.path.join(folder, "*.png")))
    if not files:
        sys.exit(f"No PNG files found in '{folder}/'. Run this from your portfolio folder.")
    for path in files:
        im = Image.open(path)
        before = count_transparent(im)
        out = clear_outer_white(im, EXTRA_SEEDS.get(os.path.basename(path), ()))
        out.save(path)
        print(f"{path}: transparent pixels {before} -> {count_transparent(out)}")
