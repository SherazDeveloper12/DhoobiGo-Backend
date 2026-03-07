import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import DbConnect from "../src/Config/Db.js";
import AuthRouter from "./Routes/authRoutes.js";


const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", AuthRouter)

DbConnect().
  then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });

  }
  ).
  catch((error) => {
    console.log("Failed to connect to the database. Server not started.", error);
  });
;


