#!/usr/bin/env python3
"""
Process SCOPE.md file and extract scoping information.

This script parses a SCOPE.md file and extracts:
- In Scope items (what MUST be built)
- Out of Scope items (what's excluded)
- Key Features (priority-ordered feature list)

Usage:
    python process_rfp_scope.py <path_to_scope.md>

Output:
    JSON with structure:
    {
        "in_scope": [...],
        "out_of_scope": [...],
        "key_features": [...]
    }
"""

import sys
import json
import re
from pathlib import Path
from typing import Dict, List, Any


def extract_section(content: str, section_name: str) -> List[str]:
    """
    Extract a markdown section by heading name.
    
    Looks for markdown headings like:
    - ## In Scope
    - ## OUT OF SCOPE
    - ## Key Features
    
    And returns list of items (bullet points) under that section.
    """
    lines = content.split('\n')
    section_start = None
    
    # Find section heading (case-insensitive)
    for i, line in enumerate(lines):
        if re.match(rf'^#+\s+{re.escape(section_name)}', line, re.IGNORECASE):
            section_start = i + 1
            break
    
    if section_start is None:
        return []
    
    # Extract bullet points until next heading or end
    items = []
    for i in range(section_start, len(lines)):
        line = lines[i].strip()
        
        # Stop at next heading
        if line.startswith('#'):
            break
        
        # Extract bullet points (-, *, or 1., 2., etc.)
        if re.match(r'^[-*]\s+(.+)', line):
            match = re.match(r'^[-*]\s+(.+)', line)
            items.append(match.group(1).strip())
        elif re.match(r'^\d+\.\s+(.+)', line):
            match = re.match(r'^\d+\.\s+(.+)', line)
            items.append(match.group(1).strip())
    
    return items


def parse_scope_file(filepath: str) -> Dict[str, Any]:
    """
    Parse SCOPE.md file and extract scoping information.
    
    Returns:
        Dict with keys: in_scope, out_of_scope, key_features
    """
    path = Path(filepath)
    
    if not path.exists():
        print(f"Error: File not found: {filepath}", file=sys.stderr)
        sys.exit(1)
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract common section names (handle variations)
    in_scope_variations = ['In Scope', 'in scope', 'InScope', 'In-Scope']
    out_scope_variations = ['Out of Scope', 'out of scope', 'OutOfScope', 'Out-of-Scope', 'Exclusions']
    features_variations = ['Key Features', 'key features', 'KeyFeatures', 'Key-Features', 'Features', 'Priorities']
    
    in_scope = []
    for variant in in_scope_variations:
        in_scope = extract_section(content, variant)
        if in_scope:
            break
    
    out_of_scope = []
    for variant in out_scope_variations:
        out_of_scope = extract_section(content, variant)
        if out_of_scope:
            break
    
    key_features = []
    for variant in features_variations:
        key_features = extract_section(content, variant)
        if key_features:
            break
    
    result = {
        'in_scope': in_scope,
        'out_of_scope': out_of_scope,
        'key_features': key_features,
        'source_file': filepath,
        'valid': len(in_scope) > 0 or len(out_of_scope) > 0 or len(key_features) > 0
    }
    
    return result


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: python process_rfp_scope.py <path_to_scope.md>", file=sys.stderr)
        sys.exit(1)
    
    filepath = sys.argv[1]
    result = parse_scope_file(filepath)
    
    # Output as JSON
    print(json.dumps(result, indent=2))
    
    # Success exit code if scope was successfully extracted
    if result['valid']:
        sys.exit(0)
    else:
        print("Warning: No scope sections found in file", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
