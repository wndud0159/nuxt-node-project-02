const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const hpp = require('hpp');
const helmet = require('helmet');
const dotenv = require('dotenv');

const prod = process.env.NODE_ENV === 'production';
const db = require("./models");
const hashtagRouter = require("./routes/hashtag");
const usersRouter = require("./routes/user");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const app = express();

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 8080


dotenv.config();
db.sequelize.sync();
// db.sequelize.sync({ force: true }); // 기존 데이터 다 날리고 새로만듬

if (prod) {
    app.use(helmet());
    app.use(hpp());
    app.use(morgan('combined'));
    app.use(cors({
        origin: 'https://wndud0159.shop',
        credentials: true,
    }));
} else {
    app.use(morgan('dev'));
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }));
    app.use("/", express.static("uploads"));
}

app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).send("노드버드 테스트 입니다");
});

app.use("/hashtag", hashtagRouter);
app.use("/user", usersRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);

app.listen(PORT, () => {
    console.log(`백엔드 서버 ${PORT}번 포트에서 실행 중`);
});
