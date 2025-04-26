import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import connectDataBase from "./Config/DB.js";
import router from "./Routes/routers.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

connectDataBase();
app.use("/api", router);

// app.use(express.static(path.join(__dirname, "/dist")));
app.use(express.static(path.join(__dirname, "/dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
// S
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
