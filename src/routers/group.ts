import { Router } from 'express';
import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';
import { Group, Permissions } from '../types/group';
import { IGroupService } from '../services/group';

const GroupValidationSchema = Joi.object<Group>({
  id: Joi.string(),
  name: Joi.string(),
  permissions: Joi.array().items(Joi.string().valid(Permissions)),
}).required();

const UsersGroupsValidationSchema = Joi.object({
  groupId: Joi.string(),
  userIds: Joi.array().items(Joi.string())
}).required();

export function createGroupRouter(groupService: IGroupService): Router {
  const router = Router();
  const validator = createValidator();

  return router
    .get<{ id: string }>(
      '/:id',
      async (request, response, next) => {
        try {
          const id = request.params.id;

          const group = await groupService.getById(id);

          if (!group) {
            return response.status(404).send('Not found!');
          }

          return response.json(group);
        } catch (error) {
          return next(error);
        }
      }
    )
    .get<{}>(
      '/',
      async (request, response, next) => {
        try {
          const groups = await groupService.getAll();

          return response.json(groups);
        } catch (error) {
          return next(error);
        }
      }
    )
    .post<any, any, Group>(
      '/',
      validator.body(GroupValidationSchema),
      async (request, response, next) => {
        try {
          const group = request.body;

          const updatedOrNewGroup = await groupService.createOrUpdate(group);

          return response.json(updatedOrNewGroup);
        } catch (error) {
          return next(error);
        }
      }
    )
    .delete<{ id: string }>(
      '/:id',
      async (request, response, next) => {
        try {
          const id = request.params.id;

          await groupService.removeHard(id);
          return response.send('Group removed!');
        } catch (error) {
          return next(error);
        }
      }
    )
    .post< { id: string }, any, { userIds: string[] } >(
      '/addUsersToGroup/:id',
      validator.body(UsersGroupsValidationSchema),
      async (request, response, next) => {
        try {
          const id = request.params.id;
          const usersIds = request.body.userIds;

          const allUsersInGroup = await groupService.addUsers(id, usersIds);
          return response.json(allUsersInGroup);
        } catch (error) {
          return next(error);
        }
      }
    );
}