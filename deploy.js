const http = require('https');
const fs = require('fs');

const files = {
    'index.html': { content: fs.readFileSync('index.html', 'utf8') },
    'app.js': { content: fs.readFileSync('app.js', 'utf8') },
    'package.json': { content: JSON.stringify({ name: 'hangaon-diagnose', version: '1.0.0', dependencies: { 'chart.js': 'latest' } }) }
};

const data = JSON.stringify({ files });

const options = {
    hostname: 'codesandbox.io',
    path: '/api/v1/sandboxes/define?json=1',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Accept': 'application/json'
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (d) => body += d);
    res.on('end', () => {
        console.log('Status code:', res.statusCode);
        console.log('Response body:', body);
        try {
            const json = JSON.parse(body);
            if (json.sandbox_id) {
                console.log('DEPLOYED_URL: https://codesandbox.io/s/' + json.sandbox_id);
            } else {
                console.log('No sandbox_id found');
            }
        } catch (e) {
            console.log('JSON parse error');
        }
    });
});

req.on('error', (error) => console.error(error));
req.write(data);
req.end();
