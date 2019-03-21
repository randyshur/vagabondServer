const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id: { 
            type: Sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        firstName: {
            type: Sequelize.STRING,
            field: 'first_name',
            allowNull: true
        },
        lastName: {
            type: Sequelize.STRING,
            field: 'last_name',
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: true
        },
        state: {
            type: Sequelize.STRING,
            allowNull: true
        },
        zip: {
            type: Sequelize.STRING,
            allowNull: true
        },
        latitude: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        longitude: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        admin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdAt: {
            type: Sequelize.DATE, 
            field: 'created_at'
        },
        updatedAt: {
            type: Sequelize.DATE, 
            field: 'updated_at'
        },
    })

    return User;
}