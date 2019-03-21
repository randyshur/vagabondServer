const Sequelize = require('sequelize');
const State = require('../db').import('../models/state');
module.exports = (sequelize, DataTypes) => {
    const Landmark = sequelize.define('landmark', {
        id: { 
            type: Sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true
        },
        city: {
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
        dateLastVisited: {
            type: Sequelize.DATE,
            field: 'date_last_visited',
            allowNull: true
        },
        imageURL: {
            type: Sequelize.STRING,
            field: 'image_url',
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
    })

    Landmark.belongsTo(State, {foreignKey: {  
        name: 'stateId',
        field: 'state_id'
      }});

    return Landmark;
}