const dotenv = require("dotenv");
dotenv.config();
const Post = require("./models/Post");
const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth"); 
const postRoute = require("./routes/posts");
const mongoose = require("mongoose"); 
const multer = require("multer");
const path = require("path")
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT =process.env.PORT || 8800;

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB")
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware

const corsOptions = {
  origin: ["http://localhost:3000", "https://anik-social-app.netlify.app/"] // Replace with your frontend domain and port
};

// Use the cors middleware with the specified options
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
})

const upload = multer({storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully")
  } catch(err) {
    console.log(err);
  }
})


app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);



app.listen(PORT, () => {
    console.log("Backend server is ready");
})