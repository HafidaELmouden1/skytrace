"""Inspect how many moving candidates each consecutive pose pair produces."""

import glob
import os
import sys

sys.path.insert(0, "backend")

from app.science.render import load_cutout
from app.science.track import Pose, _pair, catalogue

paths = sorted(glob.glob(os.path.join("data", "frames", "*0181_*.fits")))
poses = []
for path in paths:
    cut = load_cutout(path)
    poses.append(Pose(
        obs_id=os.path.basename(path)[:-5],
        mjd=float(cut.meta["mjd"]),
        detector=int(cut.meta["detector"]),
        cutout=cut,
    ))

poses.sort(key=lambda p: p.mjd)
for pose in poses:
    print(f"{pose.obs_id}  D{pose.detector}  mjd={pose.mjd:.5f}  shape={pose.cutout.image.shape}")

cats = catalogue(poses)
print("catalogues:", [len(c) for c in cats])

for i in range(len(poses) - 1):
    fixed, used, moves = _pair(cats[i], cats[i + 1])
    dt = (poses[i + 1].mjd - poses[i].mjd) * 1440
    print(f"pair {i}->{i+1}  dt={dt:.2f} min  fixes={len(fixed)}  moves={len(moves)}")
    for move in moves[:3]:
        print(f"    ({move['from']['x']},{move['from']['y']}) -> "
              f"({move['to']['x']},{move['to']['y']})  {move['px']} px")
