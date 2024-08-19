'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.AskSuggestion)
    }

    static async createuser(name,email,password,role){
      try {

        let data = await User.create({name,email,password,role})

        return data

      } catch (error) {
        throw error
      }
    }
  }
  User.init({
    name: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:"nama tidak boleh kosong"
        }
      }
    },
    password:{
    type:DataTypes.STRING,
    validate:{
      smallchar(value){
        if (value.length < 6) {
          throw new Error("password harus lebih dari 6 huruf")
        }
      }
    },
  },
    email: {type:DataTypes.STRING,
    validate:{
      notEmpty:{
        msg:"email tidak boleh kosong"
      }
    }
  },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks:{
      beforeCreate(data,option){
        const salt = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(data.password,salt)

        data.password = hash
      }
    }
  });
  return User;
};