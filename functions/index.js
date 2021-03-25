const functions = require('firebase-functions');

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const moment = require('moment');
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

app.use(express.json());

app.use(cors({
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());

app.post("/getBildirimler", async (req, res) => {
    let bildirimList = []
    await admin.database().ref("notifications").child(req.body.userid).once("value")
        .then((snap) => {
            snap.forEach((item) => {
                bildirimList.push({
                    ...item.val(),
                    id: item.key
                })
            })
            res.send(bildirimList)
        })
        .catch((error) => res.send(error));
});


app.post("/BildirimiOku", async (req, res) => {
    await admin.database().ref("notifications").child(req.body.userid).child(req.body.postid)
        .update({ readed: true })
        .then(() => {
            res.send(true);
        })
        .catch((error) => res.send(error));
});

app.post("/BildirimleriTemizle", async (req, res) => {
    await admin
        .database().ref("notifications").child(req.body.userid)
        .remove()
        .then(() => {
            res.send(true);
        })
        .catch((error) => res.send(error));
});

app.post("/BildirimiSil", async (req, res) => {
    await admin
        .database().ref("notifications").child(req.body.userid).child(req.body.id)
        .remove()
        .then(() => {
            res.status(200).send(true);
        })
        .catch((error) => res.status(201).send(error));
});


app.post("/addWorkout", async (req, res) => {
    await admin
        .database().ref("workouts").push(req.body)
        .then(() => {
            res.status(200).send(true);
        })
        .catch((error) => res.status(201).send(error));
});

exports.app = functions.https.onRequest(app);