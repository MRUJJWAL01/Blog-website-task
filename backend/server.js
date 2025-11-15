require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDb = require("./src/config/db");
const AuthRoute = require("./src/routes/auth.routes");
const PostRoute = require("./src/routes/post.routes");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 3000;
connectDb();
app.use(cookieParser());

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", AuthRoute);
app.use("/api/post",PostRoute)

app.listen(port, ()=>{
    console.log("server is running on port ",port);
})


