import { Model, Sequelize } from 'sequelize';

export class UsersGroupsModel extends Model {}

export function initUsersGroupsModel(sequelize: Sequelize) {
  UsersGroupsModel.init({}, {
    sequelize,
    modelName: 'users_groups',
    timestamps: false
  });
}