import importlib.util
import json
import pathlib
import sys
import tempfile
import types
import unittest

# Pure readback tests; no installed Hermes home or production web server.
class Router:
    def get(self, path):
        return lambda function: function

class HttpError(Exception):
    def __init__(self, status, message):
        self.status_code = status
        super().__init__(message)

sys.modules['fastapi'] = types.SimpleNamespace(APIRouter=Router, HTTPException=HttpError)
sys.modules['hermes_constants'] = types.SimpleNamespace(get_hermes_home=lambda: None)
spec = importlib.util.spec_from_file_location('adapter', pathlib.Path(__file__).parents[1] / 'dashboard/plugin_api.py')
adapter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter)

class AdapterTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.home = pathlib.Path(self.temp.name)
        adapter.get_hermes_home = lambda: self.home
        self.file = self.home / 'inner-circle/timeline.json'
        self.file.parent.mkdir()

    def read(self, **change):
        return adapter.timeline(**({'session_id':'canonical','profile':'willow','connection_id':'local'} | change))

    def write(self, sessions):
        self.file.write_text(json.dumps({'schema_version':1,'sessions':sessions}))

    def test_missing_file_is_empty_and_creates_nothing(self):
        self.assertEqual(self.read()['rows'], [])
        self.assertFalse(self.file.exists())

    def test_exact_scope_and_duplicate_routes(self):
        row = {'session_id':'canonical','profile':'willow','connection_id':'local','rows':[{'text':'Safe fixture'}]}
        self.write([row]); before=self.file.read_bytes()
        self.assertEqual(len(self.read()['rows']),1)
        for change in [{'profile':'other'},{'session_id':'../../auth.json'},{'connection_id':'remote'}]:
            self.assertEqual(self.read(**change)['rows'],[])
        self.assertEqual(self.file.read_bytes(),before)
        self.write([row,row]);self.assertEqual(self.read()['rows'],[])

    def test_invalid_json_fails_without_rewriting(self):
        self.file.write_text('{broken')
        with self.assertRaises(HttpError): self.read()
        self.assertEqual(self.file.read_text(),'{broken')

    def test_rows_are_bounded_and_bad_schema_is_empty(self):
        self.write([{'session_id':'canonical','profile':'willow','connection_id':'local','rows':list(range(1000))}])
        self.assertEqual(self.read()['rows'],list(range(200,1000)))
        self.file.write_text('[]');self.assertEqual(self.read()['rows'],[])
