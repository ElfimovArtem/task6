import express from 'express';
import expressWinston from 'express-winston';
import config from 'config';
import { logger } from './utils/logger';
import cors from 'cors';
import { initializeDB } from './db-init';

import { createUserRouter } from './routers/user';
import { UserService } from './services/user';
import { AccessorToUserData } from './data-access/user';

import { createGroupRouter } from './routers/group';
import { GroupService } from './services/group';
import { AccessorToGroupData } from './data-access/group';

import errorHandlingMiddleware from './middlewares/error-handling-middleware';
import { authValidatorMiddleware, createAuthMiddlewares } from './middlewares/auth-middleware';

const dbConnectionString = config.get<string>('dbConnectionString');
const authSecret = config.get<string>('authSecret');

const app = express();

app.use(
  express.json(),
  cors()
);

const db = initializeDB(dbConnectionString);

const accessorToUserData = new AccessorToUserData();
const userService = new UserService(accessorToUserData);

const accessorToGroupData = new AccessorToGroupData();
const groupService = new GroupService(accessorToGroupData);

const auth = createAuthMiddlewares(userService, { secret: authSecret });


app.use(
  '/',
  expressWinston.logger({ winstonInstance: logger }),
);

app.use(
  '/login',
  authValidatorMiddleware,
  auth.loginMiddleware
);

app.use(
  '/user',
  auth.tokenCheckMiddleware,
  createUserRouter(userService),
);

app.use(
  '/group',
  auth.tokenCheckMiddleware,
  createGroupRouter(groupService)
);

app.use(
  errorHandlingMiddleware
);

const server = app.listen(8080);

process.on('uncaughtException', async (error) => {
  try {
    await new Promise((resolve) => {
      logger.error('uncaughtException', error);
      logger.on('end', resolve);
    });

    if (server) {
      await new Promise(server.close.bind(server));
      console.log('Server closed!');
    }
    if (db) {
      await db.closeConnection();
      console.log('Database connection is closed!');
    }
  } finally {
    process.exit(1);
  }
});

process.on('unhandledRejection', (error) => {
  if (error) {
    logger.error('unhandledRejection', error);
  }
});