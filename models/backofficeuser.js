'use strict';
module.exports = (sequelize, DataTypes) => {
    const BackOfficeUser = sequelize.define('BackOfficeUser', {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isAlphanumeric: true,
                len: [3, 20]
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['superadmin', 'admin', 'decideur', 'daancovid19']],
            }
        },
        actif: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        createdById: {
            type: DataTypes.INTEGER,
        }
    }, {});

    BackOfficeUser.associate = function (models) {
        BackOfficeUser.belongsTo(models.BackOfficeUser, {
            as: 'CreatedBy', foreignKey: 'createdById'
        });
    };

    return BackOfficeUser;
};