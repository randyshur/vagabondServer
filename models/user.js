module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        zip: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        latitude: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            unique: true
        },
        longitude: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            unique: true
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    })

    return User;
}