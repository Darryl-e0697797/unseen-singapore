"""Launch the installed Blender without depending on interactive user scenes."""
import os, shutil, subprocess
from pathlib import Path
root = Path(__file__).resolve().parents[2]
binary = os.environ.get('BLENDER_BIN') or shutil.which('blender') or '/Applications/Blender.app/Contents/MacOS/Blender'
if not Path(binary).exists(): raise SystemExit('Blender missing. Install Blender or set BLENDER_BIN.')
subprocess.run([binary, '--background', '--factory-startup', '--python', str(root/'pipeline/blender/generate.py')], cwd=root, check=True)
