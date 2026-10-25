"""Optional read-only adapter inbox. No databases, credentials, writes or network."""
import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from hermes_constants import get_hermes_home

router = APIRouter()


@router.get('/timeline')
def timeline(session_id: str, profile: str, connection_id: str):
    """The configured producer owns this file; request values never form paths."""
    empty = {'schema_version': 1, 'connection_id': connection_id,
             'profile': profile, 'session_id': session_id, 'rows': []}
    path = Path(get_hermes_home()) / 'inner-circle' / 'timeline.json'
    if not path.is_file():
        return empty
    if path.stat().st_size > 4_000_000:
        raise HTTPException(503, 'Timeline adapter snapshot exceeds its size limit')
    try:
        payload = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, ValueError) as error:
        raise HTTPException(503, 'Timeline adapter snapshot is unavailable') from error
    if not isinstance(payload, dict) or payload.get('schema_version') != 1:
        return empty
    sessions = payload.get('sessions', [])
    if not isinstance(sessions, list):
        return empty
    matches = [item for item in sessions if isinstance(item, dict)
               and item.get('session_id') == session_id and item.get('profile') == profile
               and item.get('connection_id') == connection_id]
    if len(matches) != 1 or not isinstance(matches[0].get('rows'), list):
        return empty
    return {**empty, 'rows': matches[0]['rows'][-800:]}
