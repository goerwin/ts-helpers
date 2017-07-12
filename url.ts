import * as Bluebird from 'bluebird';
import * as http from 'http';
import * as url from 'url';

module.exports = {
  checkIfUrlExists(urlString: string) {
    const options = {
      // I was forced to use user-agent other than the browsers one
      // since it wasn't never returning 404
      headers: { 'User-Agent': 'Googlebot' },
      method: 'HEAD',
      host: url.parse(urlString).host,
      port: 80,
      path: url.parse(urlString).path
    };

    return new Bluebird((resolve, reject) => {
      http.request(options, response => {
        if (response.statusCode === 200) {
          resolve(urlString);
        } else {
          reject(new Error(`${urlString}. Status Code: ${response.statusCode}`));
        }
      })
      .on('error', reject)
      .end();
    });
  }
};
