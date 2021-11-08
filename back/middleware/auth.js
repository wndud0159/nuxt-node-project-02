const db = require("../models");
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    //인증처리를 하는곳
    // 1. 클라이언트 쿠키에서 토큰을 가져온다.
    const token = req.cookies.x_auth;
    console.log('auth token check : ', token);
    if (!token) {
        return res.json({
            error: true,
            message: "토큰이 존재하지 않습니다."
        })
    } 
    // 2. 토큰을 복호화 한 후 유저를 찾는다.
    jwt.verify(token, 'secretToken', async function (err, decoded) {
        const user = await db.User.findOne({
            where: {
                id: decoded,
            },
            attributes: ['id', 'nickname'],
            include: [
                {
                    model: db.Post,
                    attributes: ['id']
                },
                {
                    model: db.User,
                    as: 'Followings',
                    attributes: ['id']
                },
                {
                    model: db.User,
                    as: 'Followers',
                    attributes: ['id']
                }
            ]
        });
        // 3. 유저가 없으면 인증 no
        if (!user) {
            return res.json({
                error: true,
                message: '토큰을 가진 유저가 존재하지 않습니다.'
            })
        }
        req.user = user
        req.x_auth = token
        // 4. 유저가 있으면 인증 ok
        next()
    })
    
}

module.exports = {auth}