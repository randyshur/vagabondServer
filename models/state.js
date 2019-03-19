const Sequelize = require('sequelize');
const User = require('../db').import('../models/user');
module.exports = (sequelize, DataTypes) => {
    const State = sequelize.define('state', {
        id: { 
            type: Sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        },
        dateLastVisited: {
            type: Sequelize.DATE,
            field: 'date_last_visited',
            allowNull: true
        },
        comments: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE, 
            field: 'created_at'
        },
        updatedAt: {
            type: Sequelize.DATE, 
            field: 'updated_at'
        },
        userId: {
            type: Sequelize.INTEGER, 
            field: 'user_id'
        },
    },
    
    {
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'state']
            }
        ]
    });

    State.belongsTo(User, {foreignKey: {  
        name: 'userId',
        field: 'user_id'
      }});

    return State;
}
