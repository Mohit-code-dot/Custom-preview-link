const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { MongoClient } = require("mongodb");
const path = require("path");
const app = express();
const Port = 4200;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

const store = new MongoDBStore({
  uri: "mongodb+srv://WorkinX:JoPlgIK8JUpjMeuY@cluster0.qm9dld0.mongodb.net/WorkinX",
  collection: 'sessions'
});

app.use(session({
  secret: 'WorkinXdigital',
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.get("/", async (req, res) => {
  const login = req.session.login;
  const login2 = req.session.login2;
  try {
    const uri = "mongodb+srv://WorkinX:JoPlgIK8JUpjMeuY@cluster0.qm9dld0.mongodb.net/WorkinX";
    const client = new MongoClient(uri);
    const dbName = "WorkinX";
    const collectionName = "brandstores";
    const collectionName2 = "images";
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collectionDB = db.collection(collectionName);
    const collectionDB2 = db.collection(collectionName2);
    const idToFind = login;
    const idToFind2 = login2;
    console.log(idToFind);
    console.log(idToFind2);
    const filter = { _id: new mongoose.Types.ObjectId(idToFind) };
    const filter2 = { _id: new mongoose.Types.ObjectId(idToFind2) };
    const doc = await collectionDB.find(filter).toArray();
    const doc2 = await collectionDB2.find(filter2).toArray();

    if (doc && doc2) {
      res.render("test", { doc, doc2 });
    } else {
      res.send({ match: false });
    }

    await client.close();
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