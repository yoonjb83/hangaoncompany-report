import json
import urllib.request
import os

def deploy():
    with open('index.html', 'r', encoding='utf-8') as f:
        index_html = f.read()
    with open('app.js', 'r', encoding='utf-8') as f:
        app_js = f.read()

    payload = {
        "files": {
            "index.html": {"content": index_html},
            "app.js": {"content": app_js},
            "package.json": {"content": json.dumps({"name": "hangaon-diag", "main": "index.html"})}
        }
    }

    req = urllib.request.Request(
        "https://codesandbox.io/api/v1/sandboxes/define?json=1",
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )

    with urllib.request.urlopen(req) as f:
        data = json.loads(f.read().decode('utf-8'))
        print(f"SANDBOX_ID={data['sandbox_id']}")

if __name__ == "__main__":
    deploy()
