const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Habit = sequelize.define('Habit', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    frequency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.STRING,
    },
    endTime: {
        type: DataTypes.STRING,
    },
    days: {
        type: DataTypes.STRING, 
        get() {
            return this.getDataValue('days') ? this.getDataValue('days').split(',') : [];
        },
        set(value) {
            this.setDataValue('days', value.join(','));
        }
    }
});

module.exports = Habit;
