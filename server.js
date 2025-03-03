import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { connectDB } from './src/config/db.config.js';
import { app } from './src/app.js';

/** __________ Dot Env Configuration __________ */
dotenv.config();

/** __________ Server Setup __________ */
let server;
if (process.env.NODE_ENV === 'PRODUCTION') {
  try {
    const privateKey = fs.readFileSync('./privkey.pem', 'utf8');
    const certificate = fs.readFileSync('./fullchain.pem', 'utf8');

    const options = {
      key: privateKey,
      cert: certificate,
    };

    server = https.createServer(options, app);
  } catch (err) {
    console.error(
      'Error while reading privkey.pem and fullchain.pem files:',
      err
    );
  }
} else {
  server = http.createServer(app);
}

/** __________ Server Listing & DB Connection __________ */
(async () => {
  try {
    await connectDB();
    server.listen(app.get('port'), () => {
      if (process.env.NODE_ENV === 'PRODUCTION') {
        console.log('Server is running.');
      } else {
        console.info(
          '==> 🌎 Go to http://localhost:%s'.bold.cyan,
          app.get('port')
        );
        console.log(
          `Swagger Docs available at http://localhost:%s/api-docs`.bold.yellow,
          app.get('port')
        );
      }
    });
  } catch (error) {
    console.error('An error occurred while running server', error);
  }
})();
