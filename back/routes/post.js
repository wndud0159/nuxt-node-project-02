const express = require("express");
const multer = require("multer");
const multerS3 = require('multer-s3');
const path = require("path");

const {auth} = require('../middleware/auth')
const db = require("../models");

const router = express.Router();

// AWS.config.update({
//     region: 'ap-northeast-2',
//     accessKeyId: process.env.S3_ACCESS_KEY_ID,
//     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
// });

// const uploadS3 = multer({
//     storage: multerS3({
//         s3: new AWS.S3(),
//         bucket: 'vue-nodebird',
//         key(req, file, cb) {
//         cb(null, `original/${Date.now()}${path.basename(file.originalname)}`)
//         },
//     }),
//     limit: { fileSize: 20 * 1024 * 1024 },
// });



const uploadLocal = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, "uploads");
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            done(null, basename + Date.now() + ext);
        },
    }),
    limit: { fileSize: 20 * 1024 * 1024 },
});

const upload = uploadLocal



router.post("/images", upload.array("image"), (req, res) => {
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
});

router.post("/", auth, async (req, res, next) => {
    try {
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        const newPost = await db.Post.create({
            content: req.body.content,
            UserId: req.user.id, //auth 결과값
        });
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map((tag) =>
                    db.Hashtag.findOrCreate({
                        where: {
                            name: tag.slice(1).toLowerCase(),
                        },
                    })
                )
            );
            await newPost.addHashtags(result.map((r) => r[0]));
        }
        if (req.body.image) {
            if (Array.isArray(req.body.image)) {
                const images = await Promise.all(
                    req.body.image.map((image) => {
                        return db.Image.create({ src: image, PostId: newPost.id });
                    })
                );
            } else {
                const image = await db.Image.create({ src: req.body.image, PostId: newPost.id });
            }
        }

        const fullPost = await db.Post.findOne({
            where: {
                id: newPost.id,
            },
            include: [
                {
                    model: db.User,
                    attributes: ["id", "nickname"],
                },
                {
                    model: db.Image,
                },
                {
                    model: db.User,
                    as: 'Likers',
                    attributes: ['id']
                }
            ],
        });
        return res.json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
        where: { id: req.params.id },
        include: [{
            model: db.User,
            attributes: ['id', 'nickname'],
        }, {
            model: db.Image,
        }, {
            model: db.User,
            as: 'Likers',
            attributes: ['id'],
        }, {
            model: db.Post,
            as: 'Retweet',
            include: [{
            model: db.User,
            attributes: ['id', 'nickname'],
            }, {
            model: db.Image,
            }],
        }],
        });
        res.json(post);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete(`/:id`, async (req, res, next) => {
    try {
        const result = await db.Post.destroy({
            where: {
                id: req.params.id,
            },
        });
        console.log('post delete result : ', result)
        res.send('삭제했습니다.')
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get("/:id/comments", async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!post) {
            return res.status(404).send("게시글이 존재하지 않습니다.");
        }
        const comments = await db.Comment.findAll({
            where: {
                PostId: req.params.id,
            },
            include: [
                {
                    model: db.User,
                    attributes: ["id", "nickname"],
                },
            ],
            order: [["createdAt", "ASC"]],
        });
        return res.json(comments);
    } catch (error) {
        next(error);
    }
});

router.post("/:id/comment", auth, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!post) {
            return res.status(404).send("게시물이 존재하지 않습니다.");
        }
        console.log('comment with postId : ', post.id)
        const newComment = await db.Comment.create({
            PostId: post.id,
            UserId: req.user.id,
            content: req.body.content,
        });

        const comment = await db.Comment.findOne({
            where: {
                id: newComment.id,
            },
            include: [
                {
                    model: db.User,
                    attributes: ["id", "nickname"],
                },
            ],
        });
        return res.json(comment);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/retweet', auth, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: {
                id: req.params.id,
            },
            include: [{
                model: db.Post,
                as: 'Retweet', // 리트윗한 게시글이면 원본 게시글이 됨
            }]
        })
        if (!post) {
            return res.json({
                error: true,
                message: '포스트가 존재하지 않습니다.'
            })
        }
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            return res.json({
                error: true,
                message: '자신의 글은 리트윗할 수 없습니다.'
            })
        }
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await db.Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId
            }
        })
        if (exPost) {
            return res.json({
                error: true,
                message: '이미 리트윗 했습니다.'
            })
        }
        const retweet = await db.Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId, // 원본아이디
            content: 'retweet',
        })
        const retweetWithPrevPost = await db.Post.findOne({
            where: { id: retweet.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.User,
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: db.Post,
                as: 'Retweet',
                include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
                }, {
                model: db.Image,
                }],
            }],
            });
        return res.json(retweetWithPrevPost)
    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.post('/:id/like', auth, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } })
        
        if(!post) {
            return res.json({
                error: true,
                message: '포스트가 존재하지 않습니다.'
            })
        }

        await post.addLiker(req.user.id)
        return res.json({ userId: req.user.id })
        
    } catch (error) {
        console.error(error);
        next(error)
    } 
})

router.delete('/:id/like', auth, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } })
        
        if(!post) {
            return res.json({
                error: true,
                message: '포스트가 존재하지 않습니다.'
            })
        }

        await post.removeLiker(req.user.id)
        return res.json({userId: req.user.id})

    } catch (error) {
        console.error(error);
        next(error)
    } 
})



module.exports = router;
