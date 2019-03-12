module.exports = (sequelize, DataTypes) => {
    const Landmark = sequelize.define('landmark', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        zip: {
            type: DataTypes.STRING,
            allowNull: true
        },
        latitude: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        dateLastVisited: {
            type: DataTypes.DATE,
            allowNull: true
        },
        imageURL: {
            type: DataTypes.STRING,
            allowNull: true
        },
        comments: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    })

    return Landmark;
}