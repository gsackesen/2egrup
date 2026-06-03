const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');



const Category = sequelize.define("Category", {
  id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
      autoIncrement:true,
  },  
  kategori: {
      type: DataTypes.STRING,
      allowNull: false,
      minlength: 3,
      maxlength: 150
  },
  aciklama: {
      type: DataTypes.STRING,
      allowNull: true,
      minlength: 3,
      maxlength: 150
  },
  dil: {
      type: DataTypes.STRING,
      allowNull: false,
      minlength: 3,
      maxlength: 15
  }},{
  tableName: 'category',
  timestamps: true,
});


module.exports = Category;
