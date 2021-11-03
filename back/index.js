const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const db = require("./models");
const hashtagRouter = require("./routes/hashtag");
const usersRouter = require("./routes/user");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const app = express();

db.sequelize.sync();
// db.sequelize.sync({ force: true }); // 기존 데이터 다 날리고 새로만듬

app.use(morgan("dev"));
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use("/", express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())


app.get("/", (req, res) => {
    res.status(200).send("안녕 주영");
});

app.use("/hashtag", hashtagRouter);
app.use("/user", usersRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);

app.listen(8080, () => {
    console.log(`백엔드 서버 ${8080}번 포트에서 실행 중`);
});
