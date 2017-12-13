const http = require('https');

function req (data, method, key) {
    return new Promise((resolve, reject) => {
        let path = '/bins';
        if (key && method === 'PUT') path += `/${key}`;

        const options = {
            'hostname': 'api.myjson.com',
            'path': path,
            'port': 443,
            'method': method,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8'
            },
            'dataType': 'json',
            'data': data
        };

        const req = http.request(options, (res) => {
            res.setEncoding('utf8');
            let body = [];
            res.on('data', (chunk) => {
                body.push(chunk);
            });
            res.on('end', () => {
                resolve(body.join(''));
            });
        });

        req.on('error', (e) => {
            reject(e.message);
        });
        req.write(JSON.stringify(data));
        req.end();
    });
}

module.exports = {
    async get (key) {
        console.log(`Retrieving data from json store: ${key}`);
        return new Promise((resolve, reject) => {
            const request = http.get(`https://api.myjson.com/bins/${key}`, (response) => {
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
                }
                const body = [];
                response.on('data', (chunk) => body.push(chunk));
                response.on('end', () => resolve(JSON.parse(body.join(''))));
            });
            request.on('error', (err) => reject(err));
        });
    },
    async update (json, key) {
        console.log(`Updating data in json store: ${key}`);
        return req(json, 'PUT', key);
    },
    async post (json) {
        console.log('Posting data into new json store');
        return req(json, 'POST');
    }
};
