import { Sequelize } from 'sequelize';
import { initUserModel, associateUserModel } from './models/user';
import { initGroupModel, associateGroupModel } from './models/group';
import { initUsersGroupsModel } from './models/userGroups';

export let sequelize: Sequelize;

export function initializeDB() {
  if (sequelize) {
    return;
  }

  sequelize = new Sequelize(
    'node-js-epam-mentoring',
    'postgres',
    'YofGawciHetbit9',
    {
      host: 'localhost',
      dialect: 'postgres'
    }
  );

  initGroupModel(sequelize);
  initUserModel(sequelize);
  initUsersGroupsModel(sequelize);

  associateUserModel();
  associateGroupModel();

  sequelize.authenticate()
    .then(() => console.log('Success connection'))
    .catch((error: Error) => console.log(`Error in connection ${error?.message}`));

  return {
    closeConnection: sequelize.close.bind(sequelize)
  };
}