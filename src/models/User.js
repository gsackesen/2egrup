const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');



const User = sequelize.define("User", {
  id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
      autoIncrement:true,
  },  
  ad: {
      type: DataTypes.STRING,
      allowNull: false,
      minlength: 3,
      maxlength: 30
  },
  soyad: {
      type: DataTypes.STRING,
      allowNull: false,
      minlength: 3,
      maxlength: 30
  },
  avatar: {
      type: DataTypes.STRING,
      allowNull: false,           
  },
  mail: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
  },
  emailAktif:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
  },
  sifre: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
  },
  role: {
      type: DataTypes.STRING,      
      allowNull: false,      
  }},{
  tableName: 'users',
  timestamps: true,
});


module.exports = User;
