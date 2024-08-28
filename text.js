const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const session = require('express-session');
const path = require("path");
const app = express();
const Port = 8000; // Use a standard port

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public"))); // Update static file path
 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // Remove or set to false for development
  // cookie: { secure: true }
}));
 
app.get("/", async (req, res) => {
  const login = req.session.login;
  try { 
    const uri = "mongodb+srv://user01:user01@cluster0.qm9dld0.mongodb.net";
    const client = new MongoClient(uri);
    const dbName = "WorkinX"; 
    const collectionName = "brandstores";
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(dbName);
    const collectionDB = db.collection(collectionName);
    const idToFind = login;
    console.log(idToFind); 
    const filter = { _id: new ObjectId(idToFind) };
    const doc = await collectionDB.find(filter).toArray();

    if (doc) {
      res.render("test", { doc });
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
  res.redirect('/');
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});