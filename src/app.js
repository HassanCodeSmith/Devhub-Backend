/** __________ All Imports __________ */
import 'express-async-errors';
import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { serve, setup } from 'swagger-ui-express';
import { initialize, session as _session } from './config/passport.config.js';
import colors from 'colors';
import Router from './routes/index.js';
import SwagerTestRoute from './routes/swagerTest.routes.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { routeNotFound } from './middleware/routeNotFound.middleware.js';

/** __________ Dot ENV Configuration __________ */
dotenv.config();

/** __________ Express Instance __________ */
const app = express();

/** __________ Set Port __________ */
app.set('port', process.env.PORT || 8081);

/** __________ Middleware Setup __________ */
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'Qwerty@123',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(initialize());
app.use(_session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

/** __________ Enable CORS __________ */
app.use(cors());

/** __________ Morgan Logging Setup __________ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a',
});
app.use(morgan('combined', { stream: logStream }));
app.use(morgan('dev'));

/** __________ Swagger Setup __________ */
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'DevHub API',
      version: '1.0.0',
      description: 'API documentation for DevHub',
      contact: {
        name: 'Usama Aamir',
        url: 'https://github.com/usama7365/Devhub-Backend',
      },
    },
    servers: [{ url: 'http://localhost:8080' }],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', serve, setup(swaggerDocs));

/** __________ Routes Setup __________ */
Router(app);
app.use('/v1/api', SwagerTestRoute);

app.route('/').get((req, res) => {
  return res.send(`
    <body style="background-color: black; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
      <h1 style="font-size: 9rem;">Server is running.</h1>
    </body>
  `);
});

/** __________ Error Handling Middlewares __________ */
app.use(routeNotFound);
app.use(errorHandler);

export { app };
