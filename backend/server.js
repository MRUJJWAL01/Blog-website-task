require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDb = require("./src/config/db");
const AuthRoute = require("./src/routes/auth.routes");
const PostRoute = require("./src/routes/post.routes");
const UserRoute = require("./src/routes/user.route");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 3000;
connectDb();
app.use(cookieParser());

app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173',                      // local React dev
  'https://blog-website-task-flax.vercel.app', // your Vercel frontend
  process.env.CLIENT_URL,                      // optional extra from .env
].filter(Boolean);

app.use(
  cors({
    origin: [
      "https://blog-website-task-flax.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);



app.use("/api/auth", AuthRoute);
app.use("/api/post",PostRoute)
app.use("/api/user",UserRoute)

app.listen(port, ()=>{
    console.log("server is running on port ",port);
})


