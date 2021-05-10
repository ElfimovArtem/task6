import { GroupModel } from '../models/group';

import { Group } from '../types/group';
import { User } from '../types/user';

function convertToGroup(model: GroupModel): Group | null {
  if (!model) {
    return null;
  }

  return {
    id: model.id,
    name: model.name,
    permissions: model.permissions,
  };
}

export interface IAccessorToGroupData<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  createOrUpdate(group: T): Promise<T | null>;
  removeHard(id: string): Promise<boolean>;
  addUsers(groupId: string, usersIds: string[]): Promise<User[] | void>;
}

export class AccessorToGroupData implements IAccessorToGroupData<Group> {
  constructor() {}

  async getById(id: string): Promise<Group | null> {
    const group = await GroupModel.findByPk(id);

    return convertToGroup(group);
  }

  async getAll(): Promise<Group[] > {
    const group = await GroupModel.findAll();


    return group.map(convertToGroup);
  }

  async createOrUpdate(group: Group): Promise<Group | null> {
    const found: GroupModel = await GroupModel.findByPk(group.id);

    if (found) {
      const updatedGroup =  await found.update({
        name: group.name,
        permissions: group.permissions
      });

      return convertToGroup(updatedGroup);
    }

    const newGroup = await GroupModel.create({
      name: group.name,
      permissions: group.permissions
    });

    return convertToGroup(newGroup);
  }

  async removeHard(id: string) {
    await GroupModel.destroy({
      where: {
        id
      }
    });

    return true;
  }

  async addUsers(groupId: string, usersIds: string[]): Promise<User[] | void> {
    const group: GroupModel = await GroupModel.findByPk(groupId);

    await group.addUsers(usersIds);

    return group.getUsers();
  }
}