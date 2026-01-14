// models/index.js
const sequelize = require('../config/database');

// Import models
const User = require('./User');
const Expense = require('./Expense');
const Order = require('./Order');
const ForgotPasswordRequest = require('./ForgotPasswordRequest');

// Define relationships HERE (not in individual model files)
User.hasMany(Expense, { 
  foreignKey: 'userId',
  onDelete: 'CASCADE' 
});

Expense.belongsTo(User, { 
  foreignKey: 'userId' 
});

User.hasMany(Order, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Order.belongsTo(User, {
  foreignKey: 'userId',
});


// ForgotPasswordRequest relationship
User.hasMany(ForgotPasswordRequest, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

ForgotPasswordRequest.belongsTo(User, {
  foreignKey: 'userId'
});
// Export everything
module.exports = {
  sequelize,
  User,
  Expense,
  Order,
  ForgotPasswordRequest,
};