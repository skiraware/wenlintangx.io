#!/usr/bin/env python3
# generate_structure.py – creates project overview + text file contents
# Adapted for small static HTML/JS/CSS projects (2025–2026 style)
# ----------------------------------------------------------------------
import os
from pathlib import Path
import sys

# ----------------------------------------------------------------------
# CONFIGURATION
# ----------------------------------------------------------------------
OUTPUT_FILE = "project_structure_and_contents.txt"

# Folders to completely skip (never show in tree or content)
SKIP_FOLDERS_ALWAYS = {
    "node_modules", ".git", "__pycache__", "dist", "build",
    ".cache", ".expo", ".venv", "venv", "Pods", "DerivedData",
}

# Files / extensions whose *content* we never include
SKIP_CONTENT_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".svg",
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    ".mp3", ".mp4", ".mov", ".webm",
    ".zip", ".rar", ".pdf", ".docx", ".xlsx",
}

SKIP_CONTENT_FILENAMES = {
    ".DS_Store", "Thumbs.db", "desktop.ini",
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
}

# Never include content from files in these folders
SKIP_CONTENT_FOLDERS = {
    "images", "assets", "media", "fonts", "public",
}

# ----------------------------------------------------------------------
# HELPERS
# ----------------------------------------------------------------------
def is_likely_binary(path: Path) -> bool:
    try:
        with path.open("rb") as f:
            header = f.read(8192)
            if b"\0" in header:
                return True
            # Very basic signature check
            if header.startswith((b"\x89PNG", b"\xff\xd8\xff", b"GIF8", b"%PDF")):
                return True
    except:
        return True
    return False


def should_skip_tree(path: Path) -> bool:
    return any(part in SKIP_FOLDERS_ALWAYS for part in path.parts)


def should_skip_content(path: Path) -> bool:
    if path.name in SKIP_CONTENT_FILENAMES:
        return True
    if path.suffix.lower() in SKIP_CONTENT_EXTENSIONS:
        return True
    if any(p in SKIP_CONTENT_FOLDERS for p in path.parts):
        return True
    if is_likely_binary(path):
        return True
    return False


def ask_include_demo() -> bool:
    while True:
        print("\nInclude the 'demo' folder?")
        print("  y = yes (include demo/ and all its files)")
        print("  n = no  (exclude demo/ completely)")
        choice = input("y/n ? ").strip().lower()
        if choice in ("y", "yes"):
            return True
        if choice in ("n", "no", ""):
            return False
        print("Please answer y or n.\n")


# ----------------------------------------------------------------------
# TREE PRINTING (more like unix tree)
# ----------------------------------------------------------------------
def collect_tree_entries(root: Path, exclude_demo: bool):
    entries = []

    for dirpath, dirnames, filenames in os.walk(root, topdown=True):
        cur = Path(dirpath)

        if should_skip_tree(cur):
            dirnames.clear()
            continue

        # Filter directories in-place
        dirnames[:] = [d for d in dirnames if not should_skip_tree(cur / d)]

        if exclude_demo and "demo" in dirnames:
            dirnames.remove("demo")

        dirnames.sort()
        filenames.sort()

        rel = cur.relative_to(root)
        entries.append((rel, list(dirnames), list(filenames)))

    # Sort by depth then lexicographical
    entries.sort(key=lambda x: (len(x[0].parts), x[0]))

    return entries


def write_tree(fp, entries, root_name="."):
    fp.write(f"=== PROJECT STRUCTURE ({root_name}) ===\n\n")

    printed = set()

    for rel, dirs, files in entries:
        if rel == Path("."):
            fp.write(f"{root_name}/\n")
            continue

        parts = rel.parts
        for i in range(1, len(parts) + 1):
            prefix = Path(*parts[:i])
            if prefix not in printed:
                indent = "│   " * (i - 1)
                name = parts[i-1]
                fp.write(f"{indent}├── {name}/\n")
                printed.add(prefix)

        # Print files at this level
        indent = "│   " * (len(parts) - 1) if len(parts) > 1 else "    "
        all_children = dirs + files
        for j, name in enumerate(all_children):
            is_last = j == len(all_children) - 1
            branch = "└── " if is_last else "├── "
            suffix = "/" if name in dirs else ""
            fp.write(f"{indent}{branch}{name}{suffix}\n")


# ----------------------------------------------------------------------
# CONTENT DUMP
# ----------------------------------------------------------------------
def write_contents(fp, root: Path, exclude_demo: bool):
    fp.write("\n\n=== TEXT FILE CONTENTS ===\n\n")

    text_files = []

    for dirpath, _, filenames in os.walk(root):
        cur = Path(dirpath)
        if should_skip_tree(cur):
            continue
        if exclude_demo and "demo" in cur.parts:
            continue

        for fn in sorted(filenames):
            path = cur / fn
            if should_skip_content(path):
                continue
            text_files.append(path)

    text_files.sort()

    for path in text_files:
        try:
            rel = path.relative_to(root)
            fp.write(f"──── {rel} ────\n")
            content = path.read_text(encoding="utf-8", errors="replace")
            fp.write(content.rstrip() + "\n\n")
        except Exception as e:
            fp.write(f"[ERROR reading {rel}: {e}]\n\n")


# ----------------------------------------------------------------------
# MAIN
# ----------------------------------------------------------------------
def main():
    repo_root = Path(__file__).resolve().parent

    include_demo = ask_include_demo()

    if not repo_root.is_dir():
        print("Error: script must be run from project root", file=sys.stderr)
        return 1

    entries = collect_tree_entries(repo_root, exclude_demo=not include_demo)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        write_tree(f, entries)
        write_contents(f, repo_root, exclude_demo=not include_demo)

    print(f"\nDone. Output saved to: {OUTPUT_FILE}")
    print(f"demo folder: {'included' if include_demo else 'excluded'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())