import express from 'express';
import connectDB from './src/db/database.js';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './src/routes/user.routes.js';
import blogRouter from './src/routes/blog.routes.js';
import commentRouter from './src/routes/comment.routes.js';

dotenv.config({
    path: './.env'
});

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/comments', commentRouter);

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8001 , () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log('MongoDB connection failed !!', err);
})