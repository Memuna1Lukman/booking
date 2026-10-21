import sys
from pathlib import Path

_raw_dir = str(Path(__file__).resolve().parent)
if _raw_dir not in sys.path:
    sys.path.insert(0, _raw_dir)
