import express from 'express';
import { initializeDB } from './db-init';

import { createUserRouter } from './routers/user';
import { UserService } from './services/user';
import { AccessorToUserData } from './data-access/user';

import { createGroupRouter } from './routers/group';
import { GroupService } from './services/group';
import { AccessorToGroupData } from './data-access/group';

const app = express();

app.listen(8080);
app.use(express.json());

initializeDB();

const accessorToUserData = new AccessorToUserData();
const userService = new UserService(accessorToUserData);

const accessorToGroupData = new AccessorToGroupData();
const groupService = new GroupService(accessorToGroupData);

app.use(
  '/',
  createUserRouter(userService),
  createGroupRouter(groupService)
);