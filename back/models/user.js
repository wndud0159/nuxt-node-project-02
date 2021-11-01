module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            email: {
                type: DataTypes.STRING(40), // 40자이내
                allowNull: false, // 필수
            },
            nickname: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            token: {
                type: DataTypes.STRING(200),
                allowNull: true
            },
            tokenExp: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        },
        {
            charset: "utf8",
            collate: "utf8_general_ci", //한글저장
        } // sequelize가 create_at updated_at 자동으로 생성
    );
    User.associate = (db) => {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
        db.User.belongsToMany(db.Post, { through: 'Like', ad: 'Liked'})
    };
    return User;
};
