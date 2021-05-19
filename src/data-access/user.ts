import { Op } from 'sequelize';
import { UserModel } from '../models/user';

import { User } from '../types/user';

function convertToUser(model: UserModel): User | null {
  if (!model) {
    return null;
  }

  return {
    id: model.id,
    login: model.login,
    password: model.password,
    age: model.age,
    isDeleted: model.isDeleted
  };
}

export interface IAccessorToUserData<T> {
  getById(id: string): Promise<T | null>;
  createOrUpdate(user: T): Promise<T | null>;
  getSomeBySubstring(regexpString: string, limit?: number | undefined): Promise<T[] | null>;
}

export class AccessorToUserData implements IAccessorToUserData<User> {
  constructor() {}

  async getById(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id);

    return convertToUser(user);
  }

  async createOrUpdate(user: User): Promise<User | null> {
    const found: UserModel = await UserModel.findByPk(user.id);

    if (found) {
      const updatedUser =  await found.update({
        login: user.login,
        password: user.password,
        age: user.age,
        is_deleted: user.isDeleted
      });

      return convertToUser(updatedUser);
    }

    const newUser = await UserModel.create({
      login: user.login,
      password: user.password,
      age: user.age,
      isDeleted: user.isDeleted
    });

    return convertToUser(newUser);
  }

  async getSomeBySubstring(regexpString: string, limit?: number | undefined): Promise<User[]> {
    const users = await UserModel.findAll({
      where: {
        login: {
          [Op.iRegexp]: regexpString
        }
      },
      limit
    });

    return users.map(convertToUser);
  }
}