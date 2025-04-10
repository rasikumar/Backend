import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import connectDataBase from "./Config/DB.js";
import router from "./Routes/routers.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors("*"));
app.use(bodyParser.json());

connectDataBase();
app.use("/api", router);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
