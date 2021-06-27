import { Sequelize } from 'sequelize';
import { initUserModel, associateUserModel } from './models/user';
import { initGroupModel, associateGroupModel } from './models/group';
import { initUsersGroupsModel } from './models/usersGroups';

export let sequelize: Sequelize;

export function initializeDB(connectionString: string) {
  const sequelize = new Sequelize(connectionString);

  initGroupModel(sequelize);
  initUserModel(sequelize);
  initUsersGroupsModel(sequelize);

  associateUserModel();
  associateGroupModel();

  sequelize.authenticate()
    .then(() => console.log('DB success connection'))
    .catch((error: Error) => console.log(`DBrror in connection ${error?.message}`));

  return {
    closeConnection: sequelize.close.bind(sequelize)
  };
}