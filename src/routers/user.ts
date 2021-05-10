import { Router } from 'express';
import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';
import { User } from '../types/user';
import { IUserService } from '../services/user';

const UserValidationSchema = Joi.object<User>({
  id: Joi.string().required(),
  login: Joi.string().required(),
  password: Joi.string().alphanum().required(),
  age: Joi.number().greater(4).less(130).required(),
  isDeleted: Joi.bool()
}).required();

export function createUserRouter(userService: IUserService): Router {
  const router = Router();
  const validator = createValidator();

  return router
    .get<{ id: string }>(
      '/user/:id',
      async (request, response) => {
        const id = request.params.id;

        try {
          const user = await userService.getById(id);

          if (!user) {
            response.status(404).send('Not found!');
          }

          response.json(user);
        } catch (error) {
          response.status(500).send(error?.message);
        }
      })
    .post(
      '/user',
      validator.body(UserValidationSchema),
      async (request, response) => {
        const user = request.body;

        try {
          const updatedOrNewUser = await userService.createOrUpdate(user);

          response.json(updatedOrNewUser);
        } catch (error) {
          response.status(500).send(error?.message);
        }
      }
    )
    .get<{ search: string, limit: string }>(
      '/user-suggest',
      async (request, response) => {
        const { search: searchString, limit } = request.query;

        try {
          const foundUsers = await userService.search(searchString, limit);

          response.json(foundUsers);
        } catch (error) {
          response.status(500).send(error?.message);
        }
      }
    )
    .delete<{ id: string }>(
      '/user/:id',
      async (request, response) => {
        const id = request.params.id;

        try {
          await userService.removeSoftly(id);
          response.send('User removed!');
        } catch (error) {
          response.status(500).send(error?.message);
        }
      }
    );
}