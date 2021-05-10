import { Model, DataTypes, HasManyAddAssociationsMixin, HasManyGetAssociationsMixin, Sequelize } from 'sequelize';
import { Permissions } from '../types/group';
import { UserModel } from './user';
import { UsersGroupsModel } from './usersGroups';

export class GroupModel extends Model {
  id!: string;
  name!: string;
  permissions!: Permissions[];

  addUsers!: HasManyAddAssociationsMixin<UserModel, string>;
  getUsers!: HasManyGetAssociationsMixin<UserModel>;
}

export function initGroupModel(sequelize: Sequelize) {
  GroupModel.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    }
  }, {
    name: {
      singular: 'group',
      plural: 'groups'
    },
    sequelize,
    modelName: 'group',
    timestamps: false
  });
}

export function associateGroupModel() {
  GroupModel.belongsToMany(UserModel, { through: UsersGroupsModel, foreignKey: 'group_id', onDelete: 'CASCADE' });
}