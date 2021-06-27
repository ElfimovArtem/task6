import { UserService } from '../user';
import { IAccessorToUserData } from '../../data-access/user';
import { User } from '../../types/user';

const createTestUser = (data?: Partial<User>): User => ({
  id: '33333',
  login: 'myLogin',
  password: 'strongPass',
  age: 12,
  isDeleted: false,

  ...data
});

const accessor: IAccessorToUserData<User> = {
  async getById(id: string) {
    return createTestUser({ id });
  },
  async getSomeBySubstring(regexpString: string) {
    return [createTestUser({ login: regexpString })];
  },
  async createOrUpdate(entity: User) {
    return createTestUser(entity);
  }
};

describe('My tests', () => {
  it('should return true if userv successfully soft removed', async () => {
    const userService = new UserService(accessor);

    const actual = await userService.removeSoftly('123');

    expect(actual).toBe(true);
  });

  it('should return error if user was not found', async () => {
    const userService = new UserService({ ...accessor, getById: async () => null });

    await expect(userService.removeSoftly('123')).rejects.toEqual(new Error('User not found!'));
  });

  it('should return error if something happened while updating user', async () => {
    const userService = new UserService({ ...accessor, createOrUpdate: async () => null });

    await expect(userService.removeSoftly('123')).rejects.toEqual(new Error('Error while updating!'));
  });
});

describe('search', () => {
  it('should find users by substring of login', async () => {
    const userService = new UserService(accessor);

    const actual = await userService.search('myLogin', 1);

    expect(actual[0].login).toEqual('myLogin');
  });
});

describe('checkUserCredentials', () => {
  it('should return user, if login and password correct', async () => {
    const userLogin = 'userLogin';
    const userPassword = 'verysttrongpass1111';

    const userService = new UserService({
      ...accessor,
      getSomeBySubstring: async () => ([createTestUser({
        login: userLogin, password: userPassword
      })])
    });

    const actual = await userService.checkUserCredentials(userLogin, userPassword);

    expect(actual).toMatchObject({ login: userLogin, password: userPassword });
  });

  it('should return `null` password did not match', async () => {
    const userLogin = 'Artem';

    const userService = new UserService({
      ...accessor,
      getSomeBySubstring: async () => ([createTestUser({
        login: userLogin,
        password: 'random'
      })])
    });

    const actual = await userService.checkUserCredentials(userLogin, 'abrakadabra');

    expect(actual).toBeNull();
  });
});