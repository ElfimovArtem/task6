import { Model, DataTypes, Sequelize } from 'sequelize';
import { GroupModel } from './group';
import { UsersGroupsModel } from './usersGroups';

export class UserModel extends Model {
  id!: string;
  login!: string;
  password!: string;
  age!: number;
  isDeleted!: boolean;
}

export function initUserModel(sequelize: Sequelize) {
  UserModel.init({
    login: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    name: {
      singular: 'user',
      plural: 'users'
    },
    sequelize,
    modelName: 'users',
    timestamps: false
  });

}

export function associateUserModel() {
  UserModel.belongsToMany(GroupModel, { through: UsersGroupsModel, foreignKey: 'user_id' });
}