module.exports = (sequelize, DataTypes) => {
    const State = sequelize.define('state', {
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateLastVisited: {
            type: DataTypes.DATE,
            allowNull: true
        },
        comments: {
            type: DataTypes.TEXT,
            allowNull: true
        },

    })

    return State;
}