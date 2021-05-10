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
      '/group/:id',
      async (request, response) => {
        const id = request.params.id;

        try {
          const group = await groupService.getById(id);

          if (!group) {
            response.status(404).send('Not found!');
          }

          response.json(group);
        } catch (error) {
          response.status(500).send(error?.message);
        }
      }
    )
    .get<{}>(
      '/group',
      async (request, response) => {
        try {
          const groups = await groupService.getAll();

          response.json(groups);
        } catch (error) {
          response.status(500).send(error?.message);
        }
      }
    )
    .post<any, any, Group>(
      '/group',
      validator.body(GroupValidationSchema),
      async (request, response) => {
        const group = request.body;

        try {
          const updatedOrNewGroup = await groupService.createOrUpdate(group);

          response.json(updatedOrNewGroup);
        } catch (error) {
          response.status(500).send(error?.message);
        }
      }
    )
    .delete<{ id: string }>(
      '/group/:id',
      async (request, response) => {
        const id = request.params.id;

        try {
          await groupService.removeHard(id);
          response.send('Group removed!');
        } catch (error) {
          response.status(500).send(error?.message);
        }
      }
    )
    .post< { id: string }, any, { userIds: string[] } >(
      '/addUsersToGroup/:id',
      validator.body(UsersGroupsValidationSchema),
      async (request, response) => {
        const id = request.params.id;
        const usersIds = request.body.userIds;

        try {
          const allUsersInGroup = await groupService.addUsers(id, usersIds);
          response.json(allUsersInGroup);
        } catch (error) {
          response.status(500).send(error?.message);
        }
      }
    );
}