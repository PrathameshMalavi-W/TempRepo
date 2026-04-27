#!/usr/bin/env python3
"""
extract_pptx.py — Extract structured content from a PowerPoint (.pptx) file to Markdown.

Usage:
    python extract_pptx.py <file.pptx>
    python extract_pptx.py <file.pptx> --output extracted.md

Requirements:
    pip install python-pptx
"""

import argparse
import sys
from pathlib import Path


def check_dependencies():
    """Check that required libraries are installed."""
    try:
        from pptx import Presentation  # noqa: F401
    except ImportError:
        print("ERROR: python-pptx is not installed.", file=sys.stderr)
        print("Please ask the user for permission, then run: pip install python-pptx", file=sys.stderr)
        sys.exit(1)


def table_to_markdown(table) -> str:
    """Convert a pptx table object to a markdown table string."""
    rows = []
    for i, row in enumerate(table.rows):
        cells = [cell.text.replace("\n", " ").strip() for cell in row.cells]
        rows.append("| " + " | ".join(cells) + " |")
        if i == 0:
            separator = "| " + " | ".join(["---"] * len(cells)) + " |"
            rows.append(separator)
    return "\n".join(rows)


def extract_shape_text(shape) -> list[str]:
    """Extract all text from a shape, handling tables and text frames."""
    lines = []

    # Handle tables
    if shape.has_table:
        lines.append("\n**Table:**\n")
        lines.append(table_to_markdown(shape.table))
        lines.append("")
        return lines

    # Handle text frames
    if shape.has_text_frame:
        for para in shape.text_frame.paragraphs:
            text = para.text.strip()
            if not text:
                continue

            # Check if paragraph is a bullet/list item
            level = para.level  # 0 = top level, 1+ = nested
            indent = "  " * level
            bullet = f"{indent}- "

            lines.append(f"{bullet}{text}")

    return lines


def extract_pptx(filepath: str) -> str:
    """Extract content from a PPTX file and return as markdown string."""
    from pptx import Presentation
    from pptx.util import Pt

    path = Path(filepath)
    if not path.exists():
        print(f"ERROR: File not found: {filepath}", file=sys.stderr)
        sys.exit(1)

    try:
        prs = Presentation(filepath)
    except Exception as e:
        print(f"ERROR: Could not open PPTX file: {e}", file=sys.stderr)
        sys.exit(1)

    lines = []
    lines.append(f"# Presentation: {path.name}\n")
    lines.append(f"**Total slides:** {len(prs.slides)}")
    lines.append("")
    lines.append("---\n")

    for slide_num, slide in enumerate(prs.slides, start=1):
        # Get slide title
        title_text = ""
        try:
            if slide.shapes.title and slide.shapes.title.text:
                title_text = slide.shapes.title.text.strip()
        except Exception:
            title_text = ""

        lines.append(f"\n## Slide {slide_num}: {title_text or '[No Title]'}\n")

        if title_text:
            lines.append(f"**Title:** {title_text}\n")

        # Extract content from all shapes (excluding title)
        content_lines = []
        for shape in slide.shapes:
            # Skip the title shape (already handled above)
            try:
                if shape == slide.shapes.title:
                    continue
            except Exception:
                pass

            shape_content = extract_shape_text(shape)
            if shape_content:
                content_lines.extend(shape_content)

        if content_lines:
            lines.append("**Content:**")
            lines.extend(content_lines)
            lines.append("")

        # Extract speaker notes
        try:
            notes_slide = slide.notes_slide
            if notes_slide and notes_slide.notes_text_frame:
                notes_text = notes_slide.notes_text_frame.text.strip()
                if notes_text:
                    lines.append(f"\n**Speaker Notes:**\n> {notes_text.replace(chr(10), chr(10) + '> ')}\n")
        except Exception:
            pass  # Some slides may not have notes frames

        lines.append("\n---\n")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Extract structured content from a PPTX file.")
    parser.add_argument("file", help="Path to the .pptx file")
    parser.add_argument("--output", help="Output file path (default: stdout)", default=None)
    args = parser.parse_args()

    check_dependencies()
    content = extract_pptx(args.file)

    if args.output:
        Path(args.output).write_text(content, encoding="utf-8")
        print(f"Extracted content written to: {args.output}", file=sys.stderr)
    else:
        print(content)


if __name__ == "__main__":
    main()
