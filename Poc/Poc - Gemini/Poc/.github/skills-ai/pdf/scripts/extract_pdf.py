#!/usr/bin/env python3
"""
extract_pdf.py — Extract structured content from a PDF file to Markdown.

Usage:
    python extract_pdf.py <file.pdf>
    python extract_pdf.py <file.pdf> --pages 1-20
    python extract_pdf.py <file.pdf> --check-type
    python extract_pdf.py <file.pdf> --output extracted.md

Requirements:
    pip install pdfplumber
"""

import argparse
import sys
from pathlib import Path


def check_dependencies():
    """Check that required libraries are installed."""
    try:
        import pdfplumber  # noqa: F401
    except ImportError:
        print("ERROR: pdfplumber is not installed.", file=sys.stderr)
        print("Please ask the user for permission, then run: pip install pdfplumber", file=sys.stderr)
        sys.exit(1)


def parse_page_range(page_arg: str, total_pages: int) -> list[int]:
    """Parse a page range string like '1-20' or '5' into a list of 0-based page indices."""
    pages = []
    for part in page_arg.split(","):
        part = part.strip()
        if "-" in part:
            start_str, end_str = part.split("-", 1)
            start = max(1, int(start_str.strip()))
            end = min(total_pages, int(end_str.strip()))
            pages.extend(range(start - 1, end))  # convert to 0-based
        else:
            p = int(part)
            if 1 <= p <= total_pages:
                pages.append(p - 1)
    return pages


def table_to_markdown(table_data: list) -> str:
    """Convert pdfplumber table data (list of lists) to markdown table."""
    if not table_data:
        return ""

    rows = []
    for i, row in enumerate(table_data):
        cells = [str(cell).replace("\n", " ").strip() if cell is not None else "" for cell in row]
        rows.append("| " + " | ".join(cells) + " |")
        if i == 0:
            separator = "| " + " | ".join(["---"] * len(cells)) + " |"
            rows.append(separator)
    return "\n".join(rows)


def check_pdf_type(filepath: str) -> str:
    """Determine if PDF is text-based or image-based."""
    import pdfplumber

    try:
        with pdfplumber.open(filepath) as pdf:
            # Sample first 3 pages
            sample_pages = min(3, len(pdf.pages))
            total_chars = 0
            for i in range(sample_pages):
                text = pdf.pages[i].extract_text() or ""
                total_chars += len(text.strip())

            if total_chars < 50:
                return "IMAGE_BASED"
            return "TEXT_BASED"
    except Exception as e:
        return f"ERROR: {e}"


def extract_pdf(filepath: str, page_range: str | None = None) -> str:
    """Extract content from a PDF file and return as markdown string."""
    import pdfplumber

    path = Path(filepath)
    if not path.exists():
        print(f"ERROR: File not found: {filepath}", file=sys.stderr)
        sys.exit(1)

    lines = []
    lines.append(f"# Document: {path.name}\n")
    lines.append("---\n")

    try:
        with pdfplumber.open(filepath) as pdf:
            total_pages = len(pdf.pages)
            lines.append(f"**Total pages:** {total_pages}\n")
            lines.append("")

            # Determine which pages to process
            if page_range:
                page_indices = parse_page_range(page_range, total_pages)
            else:
                page_indices = list(range(total_pages))

            for page_idx in page_indices:
                page = pdf.pages[page_idx]
                page_num = page_idx + 1

                lines.append(f"\n---\n\n## Page {page_num}\n")

                # Extract tables first (they take priority)
                tables = page.extract_tables()
                table_bboxes = []
                if tables:
                    for table in tables:
                        md_table = table_to_markdown(table)
                        if md_table:
                            lines.append("\n**Table:**\n")
                            lines.append(md_table)
                            lines.append("")

                # Extract text
                text = page.extract_text(x_tolerance=3, y_tolerance=3)
                if text:
                    # Process text line by line
                    for line in text.split("\n"):
                        line = line.strip()
                        if not line:
                            continue
                        # Heuristic: very short lines that are ALL CAPS are likely headings
                        if len(line) < 80 and line.isupper() and len(line) > 3:
                            lines.append(f"\n### {line.title()}\n")
                        else:
                            lines.append(line)
                elif not tables:
                    lines.append("*[Page contains no extractable text — may be an image]*")

    except Exception as e:
        print(f"ERROR: Could not open PDF file: {e}", file=sys.stderr)
        # Try pymupdf as fallback
        try:
            import fitz
            print("INFO: Retrying with pymupdf...", file=sys.stderr)
            doc = fitz.open(filepath)
            lines = [f"# Document: {path.name} (extracted via pymupdf)\n", "---\n"]
            for page_num, page in enumerate(doc, start=1):
                text = page.get_text()
                lines.append(f"\n---\n\n## Page {page_num}\n")
                lines.append(text)
        except ImportError:
            print("ERROR: pymupdf fallback not available. Install with: pip install pymupdf", file=sys.stderr)
            sys.exit(1)

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Extract structured content from a PDF file.")
    parser.add_argument("file", help="Path to the .pdf file")
    parser.add_argument("--pages", help="Page range to extract, e.g. '1-20' or '5' or '1-5,10-15'", default=None)
    parser.add_argument("--check-type", action="store_true", help="Only determine if PDF is text-based or image-based")
    parser.add_argument("--output", help="Output file path (default: stdout)", default=None)
    args = parser.parse_args()

    check_dependencies()

    if args.check_type:
        pdf_type = check_pdf_type(args.file)
        print(pdf_type)
        return

    content = extract_pdf(args.file, args.pages)

    if args.output:
        Path(args.output).write_text(content, encoding="utf-8")
        print(f"Extracted content written to: {args.output}", file=sys.stderr)
    else:
        print(content)


if __name__ == "__main__":
    main()
