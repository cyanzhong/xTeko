import sys
import time
import traceback
from browser import document, window

class Console:
    encoding = 'utf-8'

    def __init__(self):
        self.console = document["console"]
        self.buffer = ''

    def write(self, data):
        self.buffer += str(data)

    def flush(self):
        self.console.value += self.buffer
        self.buffer = ''

    def clear(self):
        self.console.value = ''
        self.buffer = ''

    def __len__(self):
        return len(self.buffer)

if "console" in document:
    console = Console()
    sys.stdout = console
    sys.stderr = console

output = ''

def run_code(src):
    sys.stdout.clear()
    global output
    try:
        ns = {'__name__':'__main__'}
        exec(src, ns)
    except Exception:
        traceback.print_exc(file=sys.stderr)
    sys.stdout.flush()
    output = document["console"].value
    return output

window.run_code = run_code
window.notify('onload')