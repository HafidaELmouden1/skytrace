"""Ad-hoc check of the track builder against the collected poses."""

import glob
import os
import sys

sys.path.insert(0, "backend")

from app.science.render import load_cutout
from app.science.track import Pose, build_tracks

paths = sorted(glob.glob(os.path.join("data", "frames", "**", "*0181_*.fits"), recursive=True))
if not paths:
    paths = sorted(glob.glob(os.path.join("data", "frames", "*.fits")))[:4]

print("poses:", [os.path.basename(p) for p in paths])

poses = []
for path in paths:
    cut = load_cutout(path)
    poses.append(Pose(
        obs_id=os.path.basename(path)[:-5],
        mjd=float(cut.meta["mjd"]),
        detector=int(cut.meta["detector"]),
        cutout=cut,
    ))

result = build_tracks(poses)
print(f"{result['poses']} poses, span {result['span_minutes']} min, {len(result['tracks'])} tracks")
for track in result["tracks"][:6]:
    print(
        f"  {track['steps']} steps  {track['displacement_px']} px  "
        f"{track['displacement_arcsec']}\"  {track['duration_minutes']} min  "
        f"{track['speed_arcsec_per_hour']} \"/h"
    )
