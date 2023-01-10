//NOTE IMPORT
const express = require("express");
const fileUpload = require("express-fileupload");
// require("dotenv").config();
const { readdirSync } = require("fs");

//NOTE VALIABLE
const PORT = 3300;

// TriMerge
const cors = require("cors");
const corsOptions = {
   // origin: "https://comeduqanda.web.app",
   // origin: "http://202.44.34.110/",
   origin: "*",
   credentials: true,
};
const bodyParser = require("body-parser");
const morgan = require("morgan");

// Run Server
const app = express();

//NOTE MIDDLEWARE
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(cors());
app.use(fileUpload({
   // limits: {
   //     fileSize: 2000000 //2mb
   // },
   // abortOnLimit: true
}));

app.use("/qst_img", express.static("img/qst"));
app.use("/mem_img", express.static("img/user"));

//NOTE  Route
readdirSync("./Routes").map((r) => app.use("/api", require("./Routes/" + r)));
// readdirSync("./Routes").map((r) => console.log(r));
app.get("/", (req, res) => {
   res.json({ result: "ComEduQ&A" });
});

app.listen(PORT, () => {
   console.log("Sever is running ", PORT);
});
