import { IAccessorToUserData } from '../data-access/user';
import { User } from '../types/user';

export interface IUserService {
  getById(id: string): Promise<User | null>;
  createOrUpdate(user: User): Promise<User | null>;
  removeSoftly(id: string): Promise<boolean>;
  search(login: string, limit: number): Promise<User[]>;
}

export class UserService implements IUserService {
  constructor(private AccessorToUserData: IAccessorToUserData<User>) {}

  getById(id: string) {
    return this.AccessorToUserData.getById(id);
  }

  createOrUpdate(user: User) {
    return this.AccessorToUserData.createOrUpdate(user);
  }

  async removeSoftly(id: string) {
    const found = await this.getById(id);

    if (!found) {
      throw new Error('User not found!');
    }

    const updatedUser = await this.AccessorToUserData.createOrUpdate({
      ...found,
      isDeleted: true
    });

    if (!updatedUser) {
      throw new Error('Error while updating!');
    }

    return true;
  }

  async search(login: string, limit: number) {
    const foundUsers = await this.AccessorToUserData.getSomeBySubstring(login, limit);

    if (foundUsers) {
      return foundUsers;
    }

    return [];
  }
}