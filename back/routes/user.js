const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const db = require("../models");
const {auth} = require('../middleware/auth')

const router = express.Router();
const saltRounds = 10

router.get("/", auth, async (req, res, next) => {
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
        //plainPassword qwer1234, 암호화된 비밀번호 $2b$10$ygbk6ZQeQyBDANxb0zHyDuHl0tJ5eyqiixBWxDpL2YZx5UJMCUA8.
        bcrypt.compare(req.body.password, user.password, async function (err, isMatch) {
            if (err) {
                return res.json({
                    error: true,
                    message: '비밀번호가 틀렸습니다.'
                })
            }
            console.log('isMatch check : ', isMatch)
            var token = jwt.sign(user.id, 'secretToken')
            var expiryDate = new Date( Date.now() + 60 * 60 * 1000 * 24 * 7); // 24 hour 7일
            console.log('token check : ', token)
            const updateUser = await db.User.update({ token: token, tokenExp: expiryDate }, { where: { id: user.id } })
            console.log('updateUser : ', updateUser)
            return res.cookie("x_auth", token, {
                httpOnly: true,
                secure: false
            })
            .status(200)
            .json({error: false, user: user})
        })
        
    } else {
        return res.json({
            error: true,
            message: '존재하지 않는 이메일 입니다.'
        })
    }
});

router.post("/logout", (req, res) => {
    if (req.isAuthenticated()) {
        // isLoggedIn
        req.logout();
        return res.status(200).send("로그아웃 되었습니다.");
    }
});

module.exports = router;
