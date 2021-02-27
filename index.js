const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const mysql = require("mysql");

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/views"));
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "videorequest"
});
connection.connect();

app.post("/request", (req, res) => {
    const { video, name } = req.body;
    if (!video || !name) {
        return res.render("index", { requests: [], error: "Fill all fields." });
    }

    if (video.length > 128)
        return res.render("index", { requests: [], error: "Idea too long" });
    connection.query(
        "INSERT INTO request(idea, name) VALUES(?, ?)",
        [video, name],
        (err, data) => {
            if (err) throw err;
            else {
                return res.send("request received.");
            }
        }
    );
});

app.get("/", (req, res) => {
    connection.query("SELECT * FROM REQUEST", (err, data) => {
        if (err) console.log(err);
        else {
            return res.render("index", { requests: data, error: null });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server at ${PORT}`);
});