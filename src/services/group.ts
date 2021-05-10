import { IAccessorToGroupData } from '../data-access/group';
import { Group } from '../types/group';
import { User } from '../types/user';

export interface IGroupService {
  getById(id: string): Promise<Group | null>;
  getAll(): Promise<Group[]>
  createOrUpdate(group: Group): Promise<Group | null>;
  removeHard(id: string): Promise<boolean>;
  addUsers(groupId: string, usersIds: string[]): Promise<User[] | void>;
}

export class GroupService implements IGroupService {
  constructor(private AccessorToGroupData: IAccessorToGroupData<Group>) {}

  getById(id: string) {
    return this.AccessorToGroupData.getById(id);
  }

  getAll() {
    return this.AccessorToGroupData.getAll();
  }

  createOrUpdate(group: Group) {
    return this.AccessorToGroupData.createOrUpdate(group);
  }

  addUsers(groupId: string, usersIds: string[]) {
    return this.AccessorToGroupData.addUsers(groupId, usersIds);
  }

  async removeHard(id: string) {
    const found = await this.getById(id);

    if (!found) {
      throw new Error('Group not found!');
    }

    const isRemoved = this.AccessorToGroupData.removeHard(id);

    if (!isRemoved) {
      throw new Error('Error while removing group!');
    }

    return true;
  }
}