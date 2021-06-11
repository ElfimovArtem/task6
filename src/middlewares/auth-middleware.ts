import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';

import { User } from '../types/user';
import { IUserService } from '../services/user';

const SECRET = 'qwerty12345678991123sd';

type TAuthInfo = Pick<User, 'login' | 'password'>;

const AuthValidationSchema = Joi.object<TAuthInfo>({
  login: Joi.string().required(),
  password: Joi.string().alphanum().required()
}).required();

export const authValidatorMiddleware = createValidator().body(AuthValidationSchema);

export function authenticationMiddleware(userService: IUserService): RequestHandler {
  return async (request, response, next) => {
    const { login, password } = request.body;

    try {
      const user = await userService.checkUserCredentials(login, password);

      if (!user) {
        return response.status(403).send('Wrong username or password.');
      }

      const payload = { userId: user.id };
      const token = jwt.sign(payload, SECRET, { expiresIn: 300 });

      return response.send({ token });
    } catch (error) {
      return next(error);
    }
  };
}

export const checkAuth: RequestHandler = (request, response, next) => {
  const token = request.headers['x-access-token'] as string;

  if (!token) {
    return response.status(401).send('Token is not provided.');
  }

  jwt.verify(token, SECRET, (error) => {
    if (error) {
      return response.status(403).send('Invalid token.');
    }

    return next();
  });
};