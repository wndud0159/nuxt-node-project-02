const express = require("express");
const multer = require("multer");
const path = require("path");

const db = require("../models");

const router = express.Router();

const upload = multer({
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

router.post("/images", upload.array("image"), (req, res) => {
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
});

router.post("/", async (req, res, next) => {
    try {
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        const newPost = await db.Post.create({
            content: req.body.content,
            UserId: req.user.id, //시퀄라이즈 결과값
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
            ],
        });
        return res.json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
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

router.get("/:id/comment", async (req, res, next) => {
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
            order: [["createAt", "ASC"]],
        });
        return res.json(comments);
    } catch (error) {
        next(error);
    }
});

router.post("/:id/comment", async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!post) {
            return res.status(404).send("게시물이 존재하지 않습니다.");
        }
        const newComment = await db.Comment.create({
            Postid: post.id,
            UserId: req.user.id,
            comment: req.body.content,
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

module.exports = router;
