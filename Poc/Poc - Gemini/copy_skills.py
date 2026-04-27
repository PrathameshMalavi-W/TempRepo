import shutil
import os
import sys

src = r"d:\onecx\Poc - Gemini\Poc\.github\skills"
dst = r"d:\onecx\Poc - Gemini\Poc\.github\skills-ai"

try:
    print(f"Copying from {src} to {dst}")
    if os.path.exists(dst):
        print(f"Destination {dst} already exists.")
    else:
        shutil.copytree(src, dst)
        print("Copy complete!")
except Exception as e:
    print(f"Error copying: {e}", file=sys.stderr)
