#!/usr/bin/env python3
"""
extract_docx.py — Extract structured content from a DOCX file to Markdown.

Usage:
    python extract_docx.py <file.docx>
    python extract_docx.py <file.docx> --section "Functional Requirements"
    python extract_docx.py <file.docx> --output extracted.md

Requirements:
    pip install python-docx
"""

import argparse
import sys
from pathlib import Path


def check_dependencies():
    """Check that required libraries are installed."""
    try:
        import docx  # noqa: F401
    except ImportError:
        print("ERROR: python-docx is not installed.", file=sys.stderr)
        print("Please ask the user for permission, then run: pip install python-docx", file=sys.stderr)
        sys.exit(1)


def get_heading_level(paragraph):
    """Return heading level (1-6) or 0 if not a heading."""
    style_name = paragraph.style.name
    if style_name.startswith("Heading"):
        try:
            return int(style_name.split()[-1])
        except ValueError:
            return 1
    return 0


def is_bold_paragraph(paragraph):
    """Heuristic: treat all-bold paragraphs as implicit headings."""
    runs = paragraph.runs
    if not runs:
        return False
    return all(run.bold for run in runs if run.text.strip())


def table_to_markdown(table):
    """Convert a docx table to a markdown table string."""
    rows = []
    for i, row in enumerate(table.rows):
        cells = [cell.text.replace("\n", " ").strip() for cell in row.cells]
        rows.append("| " + " | ".join(cells) + " |")
        if i == 0:
            separator = "| " + " | ".join(["---"] * len(cells)) + " |"
            rows.append(separator)
    return "\n".join(rows)


def extract_docx(filepath: str, section_filter: str | None = None) -> str:
    """Extract content from a DOCX file and return as markdown string."""
    from docx import Document
    from docx.shared import Pt

    path = Path(filepath)
    if not path.exists():
        print(f"ERROR: File not found: {filepath}", file=sys.stderr)
        sys.exit(1)
    if not path.suffix.lower() == ".docx":
        print(f"WARNING: File does not have .docx extension: {filepath}", file=sys.stderr)

    try:
        doc = Document(filepath)
    except Exception as e:
        print(f"ERROR: Could not open DOCX file: {e}", file=sys.stderr)
        sys.exit(1)

    # Extract core properties (metadata)
    lines = []
    try:
        props = doc.core_properties
        lines.append(f"# Document: {path.name}\n")
        if props.title:
            lines.append(f"**Title:** {props.title}  ")
        if props.author:
            lines.append(f"**Author:** {props.author}  ")
        if props.created:
            lines.append(f"**Created:** {props.created.strftime('%Y-%m-%d')}  ")
        if props.description:
            lines.append(f"**Description:** {props.description}  ")
        lines.append("")
    except Exception:
        lines.append(f"# Document: {path.name}\n")

    lines.append("---\n")

    # Process all block-level elements in order
    # We iterate over doc.element.body children to get tables and paragraphs in order
    from docx.oxml.ns import qn

    in_section = section_filter is None
    current_heading = ""

    body = doc.element.body
    for child in body:
        tag = child.tag.split("}")[-1] if "}" in child.tag else child.tag

        if tag == "p":
            # It's a paragraph
            from docx.text.paragraph import Paragraph as DocxParagraph
            para = DocxParagraph(child, doc)
            text = para.text.strip()
            if not text:
                continue

            level = get_heading_level(para)
            if level > 0:
                # It's a heading
                prefix = "#" * min(level + 1, 6)  # shift by 1 since doc title is #
                heading_text = f"{prefix} {text}"
                current_heading = text

                # Section filter logic
                if section_filter:
                    if section_filter.lower() in text.lower():
                        in_section = True
                    elif level <= 2 and in_section and section_filter.lower() not in text.lower():
                        # We've moved past the target section
                        in_section = False

                if in_section:
                    lines.append(f"\n{heading_text}\n")
            else:
                # Regular paragraph
                if not in_section:
                    continue

                style_name = para.style.name

                # List items
                if "List" in style_name:
                    bullet = "1." if "Number" in style_name else "-"
                    lines.append(f"{bullet} {text}")
                else:
                    lines.append(f"\n{text}\n")

        elif tag == "tbl":
            if not in_section:
                continue
            # It's a table
            from docx.table import Table as DocxTable
            tbl = DocxTable(child, doc)
            lines.append("")
            lines.append(table_to_markdown(tbl))
            lines.append("")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Extract structured content from a DOCX file.")
    parser.add_argument("file", help="Path to the .docx file")
    parser.add_argument("--section", help="Filter: only extract content from this section heading", default=None)
    parser.add_argument("--output", help="Output file path (default: stdout)", default=None)
    args = parser.parse_args()

    check_dependencies()
    content = extract_docx(args.file, args.section)

    if args.output:
        Path(args.output).write_text(content, encoding="utf-8")
        print(f"Extracted content written to: {args.output}", file=sys.stderr)
    else:
        print(content)


if __name__ == "__main__":
    main()
