#!/usr/bin/env python3
"""
Analyze which requirements OneCX can handle directly vs. which need custom implementation.

This script maps requirement keywords to OneCX capabilities and generators,
providing effort estimates and identifying custom implementation needs.

Usage:
    python analyze_requirement_coverage.py <requirement_description>
    
    Or process JSON input:
    python analyze_requirement_coverage.py --json < requirements.json

Output:
    JSON with structure:
    {
        "requirement": "...",
        "matched_capabilities": [...],
        "custom_implementation_needed": bool,
        "estimated_effort_hours": int
    }
"""

import sys
import json
import re
from typing import List, Dict, Any, Optional

# OneCX capability mapping
ONECX_CAPABILITIES = {
    'search': {
        'name': 'Employee Search / Filtering',
        'generator': '@onecx/generators:search-page',
        'keywords': ['search', 'filter', 'query', 'find', 'lookup', 'browse'],
        'effort_hours': 3,
        'difficulty': 'easy',
        'description': 'Built-in OneCX search page generator with filtering support'
    },
    'detail': {
        'name': 'Detail View Page',
        'generator': '@onecx/generators:detail-page',
        'keywords': ['view', 'show', 'display', 'detail', 'information', 'profile'],
        'effort_hours': 2,
        'difficulty': 'easy',
        'description': 'OneCX detail page for viewing individual item information'
    },
    'crud_create': {
        'name': 'Create Dialog / Form',
        'generator': '@onecx/generators:dialog-form',
        'keywords': ['create', 'add', 'new', 'insert'],
        'effort_hours': 4,
        'difficulty': 'easy',
        'description': 'OneCX modal dialog for creating new items'
    },
    'crud_update': {
        'name': 'Update Dialog / Form',
        'generator': '@onecx/generators:dialog-form',
        'keywords': ['update', 'edit', 'modify', 'change', 'alter'],
        'effort_hours': 4,
        'difficulty': 'easy',
        'description': 'OneCX modal dialog for updating existing items'
    },
    'crud_delete': {
        'name': 'Delete Confirmation',
        'generator': 'Custom Dialog',
        'keywords': ['delete', 'remove', 'archive', 'discard'],
        'effort_hours': 2,
        'difficulty': 'easy',
        'description': 'Simple confirmation dialog for deletions'
    },
    'authentication': {
        'name': 'Authentication & Authorization',
        'generator': '@onecx/angular-accelerator:auth-guard',
        'keywords': ['login', 'authentication', 'auth', 'secure', 'user', 'access', 'permission'],
        'effort_hours': 3,
        'difficulty': 'medium',
        'description': 'OneCX built-in authentication with OIDC support'
    },
    'data_table': {
        'name': 'Data Table / List',
        'generator': '@onecx/angular-accelerator:data-table',
        'keywords': ['list', 'table', 'grid', 'rows', 'records', 'items'],
        'effort_hours': 3,
        'difficulty': 'easy',
        'description': 'PrimeNG-based data table with sorting, pagination'
    },
    'forms': {
        'name': 'Reactive Forms',
        'generator': '@onecx/angular-accelerator:form',
        'keywords': ['form', 'input', 'field', 'validate', 'submission'],
        'effort_hours': 4,
        'difficulty': 'easy',
        'description': 'OneCX reactive form builder with validation'
    },
    'ngrx_state': {
        'name': 'State Management (NGRX)',
        'generator': '@onecx/generators:ngrx-store',
        'keywords': ['state', 'store', 'redux', 'ngrx', 'management'],
        'effort_hours': 6,
        'difficulty': 'medium',
        'description': 'NGRX store setup for complex state management'
    },
    'audit': {
        'name': 'Audit Logging',
        'generator': 'Custom + Backend',
        'keywords': ['audit', 'log', 'history', 'tracking', 'changes', 'who', 'when'],
        'effort_hours': 8,
        'difficulty': 'hard',
        'description': 'Requires backend audit service + UI for audit display'
    },
    'reporting': {
        'name': 'Reporting / Dashboards',
        'generator': 'Custom',
        'keywords': ['report', 'dashboard', 'analytics', 'visualization', 'graph', 'chart'],
        'effort_hours': 12,
        'difficulty': 'hard',
        'description': 'Custom implementation, may use PrimeNG charts'
    },
    'integration': {
        'name': 'Backend Integration',
        'generator': 'Custom HTTP Client',
        'keywords': ['api', 'backend', 'integrate', 'connect', 'service', 'endpoint'],
        'effort_hours': 4,
        'difficulty': 'medium',
        'description': 'HTTP service to backend API/third-party integration'
    },
    'ldap': {
        'name': 'LDAP / Directory Integration',
        'generator': 'Custom',
        'keywords': ['ldap', 'active directory', 'ad', 'directory', 'corporate', 'sso'],
        'effort_hours': 10,
        'difficulty': 'hard',
        'description': 'Custom LDAP/AD connector, usually backend responsibility'
    },
    'permissions': {
        'name': 'Role-Based Access Control',
        'generator': 'Custom',
        'keywords': ['permission', 'role', 'rbac', 'access', 'policy', 'authorization'],
        'effort_hours': 6,
        'difficulty': 'medium',
        'description': 'Custom role-based access control implementation'
    }
}


def analyze_requirement(requirement_text: str) -> Dict[str, Any]:
    """
    Analyze a requirement and suggest OneCX capabilities.
    
    Returns:
        Dict with matched capabilities and effort estimates
    """
    requirement_lower = requirement_text.lower()
    
    # Track which capabilities match
    matches = []
    total_effort = 0
    max_difficulty = 0
    difficulty_levels = {'easy': 1, 'medium': 2, 'hard': 3}
    
    for cap_id, cap_info in ONECX_CAPABILITIES.items():
        difficulty_score = difficulty_levels.get(cap_info['difficulty'], 1)
        
        # Check if any keyword matches
        matched_keywords = []
        for keyword in cap_info['keywords']:
            if re.search(rf'\b{keyword}\b', requirement_lower):
                matched_keywords.append(keyword)
        
        if matched_keywords:
            matches.append({
                'id': cap_id,
                'name': cap_info['name'],
                'generator': cap_info['generator'],
                'effort_hours': cap_info['effort_hours'],
                'difficulty': cap_info['difficulty'],
                'description': cap_info['description'],
                'matched_keywords': matched_keywords
            })
            
            # Track effort
            total_effort += cap_info['effort_hours']
            max_difficulty = max(max_difficulty, difficulty_score)
    
    # Determine if custom implementation is needed
    needs_custom = False
    custom_reason = None
    
    # If no OneCX matches found
    if not matches:
        needs_custom = True
        custom_reason = "No matching OneCX capabilities found"
    
    # If requirement mentions "integration" or "custom"
    elif 'integration' in requirement_lower or 'custom' in requirement_lower:
        # Check if it's LDAP, third-party, or complex integration
        if any(word in requirement_lower for word in ['ldap', 'active directory', 'api', 'sap', 'salesforce', 'external']):
            needs_custom = True
            custom_reason = "Complex integration requirement"
    
    return {
        'requirement': requirement_text,
        'matched_capabilities': matches,
        'custom_implementation_needed': needs_custom,
        'custom_reason': custom_reason,
        'total_estimated_effort_hours': total_effort,
        'max_difficulty': ONECX_CAPABILITIES[matches[0]['id']]['difficulty'] if matches else 'unknown',
        'match_count': len(matches)
    }


def analyze_multiple_requirements(requirements: List[str]) -> Dict[str, Any]:
    """
    Analyze multiple requirements and aggregate statistics.
    """
    results = {
        'total_requirements': len(requirements),
        'requirements_analyzed': [],
        'summary': {
            'total_effort_hours': 0,
            'requirements_with_onecx_support': 0,
            'requirements_needing_custom': 0,
            'unique_capabilities': set(),
            'difficulty_breakdown': {
                'easy': 0,
                'medium': 0,
                'hard': 0
            }
        }
    }
    
    for req in requirements:
        analysis = analyze_requirement(req)
        results['requirements_analyzed'].append(analysis)
        
        # Update summary
        results['summary']['total_effort_hours'] += analysis['total_estimated_effort_hours']
        
        if analysis['matched_capabilities']:
            results['summary']['requirements_with_onecx_support'] += 1
            for cap in analysis['matched_capabilities']:
                results['summary']['unique_capabilities'].add(cap['id'])
                results['summary']['difficulty_breakdown'][cap['difficulty']] += 1
        
        if analysis['custom_implementation_needed']:
            results['summary']['requirements_needing_custom'] += 1
    
    # Convert set to list for JSON serialization
    results['summary']['unique_capabilities'] = list(results['summary']['unique_capabilities'])
    
    # Calculate averages
    if len(requirements) > 0:
        results['summary']['average_effort_per_req'] = round(
            results['summary']['total_effort_hours'] / len(requirements), 1
        )
    
    return results


def main():
    """Main entry point."""
    
    # Check for command line arguments
    if len(sys.argv) < 2:
        print("Usage:", file=sys.stderr)
        print("  Single requirement:", file=sys.stderr)
        print("    python analyze_requirement_coverage.py \"User must search employees\"", file=sys.stderr)
        print("  JSON input:", file=sys.stderr)
        print("    python analyze_requirement_coverage.py --json < requirements.json", file=sys.stderr)
        sys.exit(1)
    
    # Process JSON input
    if sys.argv[1] == '--json':
        try:
            input_data = json.load(sys.stdin)
            
            if isinstance(input_data, list):
                requirements = input_data
            elif isinstance(input_data, dict) and 'requirements' in input_data:
                requirements = input_data['requirements']
            else:
                requirements = [input_data]
            
            results = analyze_multiple_requirements(requirements)
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}", file=sys.stderr)
            sys.exit(1)
    
    # Process single requirement from command line
    else:
        requirement_text = ' '.join(sys.argv[1:])
        results = analyze_requirement(requirement_text)
    
    # Output as JSON
    print(json.dumps(results, indent=2))


if __name__ == '__main__':
    main()
