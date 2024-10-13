const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const schema = {
  name: String,
  email: String,
  dob: Date,
  phone: String,
  additionalInfo: String,
  image: {
    data: Buffer,
    contentType: String
  }
};

const monmodel = mongoose.model("NEWCOL", schema);

async function connectToDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mynewdb");
  } catch (err) {
    console.log("error connecting to db:", err);
  }
}

connectToDB();

const upload = multer({
  dest: "./public/uploads/",
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file) {
      return cb(new Error("Please upload a file!"));
    }
    cb(undefined, true);
  }
});

app.post("/postContactInfo", upload.single("image"), async (req, res) => {
  const data = new monmodel({
    name: req.body.name,
    email: req.body.email,
    dob: req.body.dob,
    phone: req.body.phone,
    additionalInfo: req.body.additionalInfo,
    image: {
      data: req.file.buffer,
      contentType: req.file.mimetype
    }
  });

  try {
    const val = await data.save();
    res.json(val);
  } catch (err) {
    console.log("error saving data:", err);
    res.status(500).json({ message: "Error saving data" });
  }
});

app.get("/getContactInfo", async (req, res) => {
  try {
    const data = await monmodel.find();
    res.json(data);
  } catch (err) {
    console.log("Error retrieving data:", err);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

app.listen(3000, () => {
  console.log("on port 3000");
});
