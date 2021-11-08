const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const db = require("../models");
const {auth} = require('../middleware/auth')

const router = express.Router();
const saltRounds = 10

router.get("/", auth, async (req, res, next) => {
    console.log('user : ', req.user.Posts)
    res.json({
        error: false,
        user: req.user,
    });
});

router.post("/", async (req, res, next) => {
    try {
        const exUser = await db.User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (exUser) {
            // 이미 회원가입되어있으면
            return res.json({
                error: true,
                message: "이미 회원가입 되어있습니다.",
            });
        }

        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
            
            bcrypt.hash(req.body.password, salt, async function (err, hash) {
                if (err) return next(err)
                    await db.User.create({
                        email: req.body.email,
                        password: hash,
                        nickname: req.body.nickname,
                    });
            })
        })
        return res.json({
            error: false,
            message: "회원가입 성공"
        })
    } catch (error) {
        console.error("user create error : ", error);
        return next(error);
    }
});

router.post("/login", async (req, res, next) => {

    const user = await db.User.findOne({
        where: {
            email: req.body.email,
        },
    });

    if (user) {
        // 비번이 맞는지 체크
        bcrypt.compare(req.body.password, user.password, async function (err, isMatch) {
            if (err) {
                console.error(err)
                return next(err)
            }
            if (!isMatch) {
                return res.json({
                    error: true,
                    message: '비밀번호가 틀렸습니다.'
                })
            }
            var token = jwt.sign(user.id, 'secretToken')
            var expiryDate = new Date( Date.now() + 60 * 60 * 1000 * 24 * 7); // 24 hour 7일
            console.log('token check : ', token)
            await db.User.update({ token: token, tokenExp: expiryDate }, { where: { id: user.id } })

            const fullUser = await db.User.findOne({
                where: {
                    id: user.id
                },
                attributes: ['id', 'email', 'nickname'],
                include: [
                    {
                        model: db.Post,
                        as: 'Posts',
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
            })


            // return res.cookie("x_auth", token, {
            //     // httpOnly: true,
            //     secure: false,
            //     expires: expiryDate
            // })
            return res.status(200)
            .json({error: false, user: fullUser, token: token})
        })
        
    } else {
        return res.json({
            error: true,
            message: '존재하지 않는 이메일 입니다.'
        })
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie('x_auth').json({
        error: false,
        user: null,
        message: '로그아웃 성공'
    })
});

router.post('/:id/follow', auth, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: req.user.id
            }
        })
        await user.addFollowing(req.params.id);
        res.send(req.params.id)
    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.delete('/:id/follow', auth, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: req.user.id
            }
        })
        await user.removeFollowing(req.params.id);
        res.send(req.params.id)
    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.patch('/nickname', auth, async (req, res, next) => {
    try {
        await db.User.update({ nickname: req.body.nickname }, { where: { id: req.user.id } })
        res.send(req.body.nickname)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get('/:id/followings', auth, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: req.user.id },
        });
        const followings = await user.getFollowings({
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit || 3, 10),
            offset: parseInt(req.query.offset || 0, 10),
        });
        res.json(followings);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/:id/followers', auth, async (req, res, next) => {
    try {
    const user = await db.User.findOne({
        where: { id: req.user.id },
    });
    const followers = await user.getFollowers({
        attributes: ['id', 'nickname'],
        limit: parseInt(req.query.limit || 3, 10),
        offset: parseInt(req.query.offset || 0, 10),
    });
    res.json(followers);
    } catch (err) {
    console.error(err);
    next(err);
    }
    });

router.delete('/:id/follower', auth, async (req, res, next) => {
    try {
    const me = await db.User.findOne({
        where: { id: req.user.id },
    });
    await me.removeFollower(req.params.id);
    res.send(req.params.id);
    } catch (err) {
    console.error(err);
    next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const user = await db.User.findOne({
        where: { id: parseInt(req.params.id, 10) },
        include: [{
            model: db.Post,
            as: 'Posts',
            attributes: ['id'],
        }, {
            model: db.User,
            as: 'Followings',
            attributes: ['id'],
        }, {
            model: db.User,
            as: 'Followers',
            attributes: ['id'],
        }],
        attributes: ['id', 'nickname'],
        });
        res.json(user);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/:id/posts', async (req, res, next) => {
    try {
        let where = {
        UserId: parseInt(req.params.id, 10),
        RetweetId: null,
        };
        if (parseInt(req.query.lastId, 10)) {
        where[db.Sequelize.Op.lt] = parseInt(req.query.lastId, 10);
        }
        const posts = await db.Post.findAll({
        where,
        include: [{
            model: db.User,
            attributes: ['id', 'nickname'],
        }, {
            model: db.Image,
        }, {
            model: db.User,
            through: 'Like',
            as: 'Likers',
            attributes: ['id'],
        }],
        });
        res.json(posts);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;
