const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const path = require("path");
const app = express();
const Port = 4200;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: 'WorkinXdigital',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// Connect to MongoDB using Mongoose
const uri = "mongodb+srv://WorkinX:JoPlgIK8JUpjMeuY@cluster0.qm9dld0.mongodb.net/WorkinX?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tlsAllowInvalidCertificates: true // Disable certificate validation (dev only)
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

const brandstoreSchema = new mongoose.Schema({}, { collection: 'brandstores' });
const imageSchema = new mongoose.Schema({}, { collection: 'images' });
const Brandstore = mongoose.model('Brandstore', brandstoreSchema);
const Image = mongoose.model('Image', imageSchema);

app.get("/", async (req, res) => {
  const login = req.session.login;
  const login2 = req.session.login2;
  try {
    const idToFind = login;
    const idToFind2 = login2;

    console.log(idToFind);
    console.log(idToFind2);

    const doc = await Brandstore.find({ _id: new mongoose.Types.ObjectId(idToFind) }).lean();
    const doc2 = await Image.find({ _id: new mongoose.Types.ObjectId(idToFind2) }).lean();

    if (doc && doc2) {
      res.render("test", { doc, doc2 });
    } else {
      res.send({ match: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/post", (req, res) => {
  req.session.login = req.body.login;
  req.session.login2 = req.body.login2;
  res.redirect('/');
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
