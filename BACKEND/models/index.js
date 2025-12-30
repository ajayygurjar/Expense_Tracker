// models/index.js
const sequelize = require('../config/database');

// Import models
const User = require('./User');
const Expense = require('./Expense');

// Define relationships HERE (not in individual model files)
User.hasMany(Expense, { 
  foreignKey: 'userId',
  onDelete: 'CASCADE' 
});

Expense.belongsTo(User, { 
  foreignKey: 'userId' 
});

// Export everything
module.exports = {
  sequelize,
  User,
  Expense
};