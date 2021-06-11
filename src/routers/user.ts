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
      '/:id',
      async (request, response, next) => {
        const id = request.params.id;

        try {
          const user = await userService.getById(id);

          if (!user) {
            return response.status(404).send('Not found!');
          }

          return response.json(user);
        } catch (error) {
          return next(error);
        }
      })
    .post(
      '/',
      validator.body(UserValidationSchema),
      async (request, response, next) => {
        const user = request.body;

        try {
          const updatedOrNewUser = await userService.createOrUpdate(user);

          return response.json(updatedOrNewUser);
        } catch (error) {
          return next(error);
        }
      }
    )
    .get<{ search: string, limit: string }>(
      '/user-suggest',
      async (request, response, next) => {
        const { search: searchString, limit } = request.query;

        try {
          const foundUsers = await userService.search(searchString, limit);

          return response.json(foundUsers);
        } catch (error) {
          return next(error);
        }
      }
    )
    .delete<{ id: string }>(
      '/:id',
      async (request, response, next) => {
        const id = request.params.id;

        try {
          await userService.removeSoftly(id);
          return response.send('User removed!');
        } catch (error) {
          return next(error);
        }
      }
    );
}