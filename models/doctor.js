'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor.hasMany(models.Article)
      Doctor.hasMany(models.AskSuggestion)
      Doctor.hasMany(models.ProfileDoctor)
    }
    get doctorfront(){
      return `Doctor ${this.name}`
    }

  }
  Doctor.init({
    name: {
      type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:"nama tidak boleh kosong"
        }
      }},
    role: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{
          msg:"Role tidak boleh kosong"
        },
        notNull:{
          msg:"Role tidak boleh kosong"
        }
      }},
    email: {
      type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:"email tidak boleh kosong"
        }
      }},
    password: {
      type:DataTypes.STRING,
      validate:{
        smallchar(value){
          if (value.length < 6) {
            throw new Error("password harus lebih dari 6 huruf")
          }
        }
      }
    }
  }, 
  
  {
    sequelize,
    modelName: 'Doctor',
    hooks:{
      beforeCreate(data,option){
        const salt = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(data.password,salt)

        data.password = hash
      }
    }
  });
  return Doctor;
};