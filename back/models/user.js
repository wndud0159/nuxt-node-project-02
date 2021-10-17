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
        },
        {
            charset: "utf8",
            collate: "utf8_general_ci", //한글저장
        } // sequelize가 create_at updated_at 자동으로 생성
    );
    User.associate = (db) => {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
    };
    return User;
};
