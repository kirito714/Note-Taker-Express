// Dependencies

const fs = require("fs/promises");
const express = require("express");
const uuid = require("uuid");
const dbFilePath = __dirname + "/db/db.json";


// Sets up the Express App

const app = express();
const PORT = 3000;
// parses the body of the request
//places the data on the `req body`
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// servers all of our files in public assets
app.use(express.static("public"));

// basic route that sends the user first to the AJAX page.
app.get(`/`, (req, res) => res.sendFile(__dirname + `/public/index.html`));

app.get(`/notes`, (req, res) => res.sendFile(__dirname + `/public/notes.html`));

// GET - /api/notes
app.get("/api/notes", async function (req, res) {
  // Read the data from disk.
  try {
    const data = await fs.readFile(dbFilePath, "utf-8");
    //response then parse the data
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(575).end("server failed");
    console.log(err);
  }
});

// Post - /api/notes
app.post("/api/notes", async function (req, res) {
  try {
    // store data in variable
    const note = req.body;
    // Read the data from disk.
    const content = await fs.readFile(dbFilePath, "utf8");
    /// parse out data the data using JSON.parse
    const data = JSON.parse(content);
    note.id = uuid.v1();
    //add data to parsed array
    data.push(note);
    /// waits then writes the data to the page
    await fs.writeFile(dbFilePath, JSON.stringify(data));
    //respond to front end

    res.json(note);
  } catch (err) {
    res.status(512).end("server failed");
    console.log(err);
  }
});

// / delete - /api/notes
app.delete("/api/notes/:id", async function (req, res) {
  // store data in variable
  try {
    const note = req.body;
    // Read the data from disk.
    const content = await fs.readFile(dbFilePath, "utf8");
    // this method tells if true or false
    /// parse out data the data using JSON.parse
    let data = JSON.parse(content);
    // filter over the current array and then post a new array.
    console.log(Array.isArray(data));
    data = data.filter((notes, index, array) => notes.id !== req.params.id);

    /// waits then writes the data to the page
    await fs.writeFile(dbFilePath, JSON.stringify(data));
    //respond to front end
    res.json(note);
  } catch (err) {
    res.status(512).end("server failed");
    console.log(err);
  }
});


app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
