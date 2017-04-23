const http = require('http');
const url = require('url');
const Bluebird = require('bluebird');

module.exports = {
  checkIfUrlExists(urlString) {
    const options = {
      method: 'HEAD',
      host: url.parse(urlString).host,
      port: 80,
      path: url.parse(urlString).path,
      // Need to use a diferent user-agent but the browsers one since it wasn't never returning 404
      headers: { 'User-Agent': 'Googlebot' }
    };

    return new Bluebird((resolve, reject) => {
      http.request(options, response => {
        if (response.statusCode === 200) resolve(urlString);
        else reject(new Error(`${urlString}. Status Code: ${response.statusCode}`));
      })
      .on('error', reject)
      .end();
    });
  }
};
