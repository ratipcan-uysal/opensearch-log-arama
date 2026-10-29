"""Static fixture checks only. Does not contact or emulate OpenSearch."""
import json
from pathlib import Path
from collections import Counter
from datetime import datetime

ROOT = Path(__file__).resolve().parent
parsed = {p.name: json.loads(p.read_text()) for p in ROOT.glob('*.json')}
logs = [json.loads(line) for line in (ROOT / 'logs.ndjson').read_text().splitlines()]
bulk = [json.loads(line) for line in (ROOT / 'bulk.ndjson').read_text().splitlines()]
assert len(logs) == 12 and len(bulk) == 24
assert (ROOT / 'bulk.ndjson').read_bytes().endswith(b'\n')
assert len({d['event_id'] for d in logs}) == len(logs)
props = parsed['mapping.json']['mappings']['properties']
for i, doc in enumerate(logs):
    assert bulk[i*2] == {'create': {'_id': doc['event_id']}}
    assert bulk[i*2+1] == doc
    assert set(doc) <= set(props)
    for field, value in doc.items():
        kind = props[field]['type']
        if kind == 'date': datetime.fromisoformat(value.replace('Z', '+00:00'))
        elif kind == 'integer': assert type(value) is int
        elif kind == 'float': assert isinstance(value, (float, int))
        else: assert isinstance(value, str)

scope = [d for d in logs if '2026-10-29T10:00:00Z' <= d['@timestamp'] < '2026-10-29T10:15:00Z' and d['environment']=='prod']
checkout = [d for d in scope if d['service_name']=='checkout']
errors = [d for d in checkout if 500 <= d.get('status_code', 0) < 600]
assert [d['event_id'] for d in sorted(errors, key=lambda d:(d['@timestamp'],d['event_id']), reverse=True)] == ['evt-011','evt-003','evt-002']
assert {d['event_id'] for d in checkout if 'status_code' in d and d['status_code']!=200} == {'evt-002','evt-003','evt-009','evt-011'}
assert {d['event_id'] for d in checkout if 'status_code' not in d} == {'evt-005','evt-012'}
assert Counter(d['service_name'] for d in scope if 500 <= d.get('status_code',0) < 600) == {'checkout':3,'catalog':1}
denominator=[d for d in checkout if d['event_kind']=='request_completed' and 'status_code' in d]
assert len(denominator)==7 and len(errors)==3
assert 40/1000 / (50/10000) == 8
assert parsed['ppl-request.json']['query'] == (ROOT/'errors-by-service.ppl').read_text()
filters=parsed['search.json']['query']['bool']['filter']
assert {'range':{'status_code':{'gte':500,'lt':600}}} in filters
assert {'range':{'@timestamp':{'gte':'2026-10-29T10:00:00Z','lt':'2026-10-29T10:15:00Z'}}} in filters
assert parsed['error-rate.json']['track_total_hits'] is True
print('PASS: JSON/NDJSON, mapping types, 12 records, expected scopes and arithmetic. No live OpenSearch test.')
