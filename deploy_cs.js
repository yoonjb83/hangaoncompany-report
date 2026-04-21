const https = require('https');
const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

const payload = JSON.stringify({
    files: {
        'index.html': { content: indexHtml },
        'app.js': { content: appJs },
        'package.json': { content: JSON.stringify({ name: 'hangaon-company-diagnostic', main: 'index.html' }) }
    }
});

const options = {
    hostname: 'codesandbox.io',
    path: '/api/v1/sandboxes/define?json=1',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            console.log('SANDBOX_ID=' + response.sandbox_id);
        } catch (e) {
            console.error('Failed to parse response: ' + data);
        }
    });
});

req.on('error', (e) => {
    console.error('Request error: ' + e.message);
});

req.write(payload);
req.end();
