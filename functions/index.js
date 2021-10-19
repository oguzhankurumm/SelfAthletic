const functions = require('firebase-functions');

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');

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


//ADMIN PANEL
const verifyJWT = (req, res, next) => {
    const token = req.headers["authorization"]
    if (!token) {
        res.json({ auth: false })
    }
    else {
        jwt.verify(token, 'jwtSecret', (err, _) => {

            if (err) { res.json({ auth: false }) }

            else { next(); }
        })
    }
}

app.get("/isUserAuth", verifyJWT, (req, res) => {
    res.json({ auth: true })
})

app.post("/loginRefresh", async (req, res) => {
    const idToken = req.body.idToken;

    await admin
        .auth()
        .verifyIdToken(idToken)
        .then(async (claims) => {

            if (claims.email !== undefined && claims.admin === true) {
                res.json({ loggedIn: true, role: claims.admin });
            }
            else if (claims.email !== undefined && claims.admin !== true) {

                res.json({ loggedIn: true, role: false });
            }
            else {
                res.json({ loggedIn: false, message: "Kullanıcı bulunamadı" });
            }
        })
        .catch((error) => {
            res.send(JSON.stringify({ status: error.code }));
        });
})


app.post("/adminLogin", async (req, res) => {
    const idToken = req.body.idToken;
    const id = req.body.id;

    await admin.auth().verifyIdToken(idToken)
        .then(async (claims) => {

            if (claims.email !== undefined && claims.admin === true) {
                const token = jwt.sign({ id }, "jwtSecret", {
                    expiresIn: "48h"
                })

                res.json({ loggedIn: true, token: token, role: claims.admin });
            }
            else if (claims.email !== undefined && claims.admin !== true) {
                const token = jwt.sign({ id }, "jwtSecret", {
                    expiresIn: "48h"
                })
                res.json({ loggedIn: true, token: token, role: false });
            }
            else {
                res.json({ loggedIn: false, message: "Kullanıcı bulunamadı" });
            }
        })
        .catch((error) => {
            res.send(JSON.stringify({ status: error.code }));
        });
});

app.get("/getSliders", async (req, res) => {
    try {
        const response = await admin.firestore().collection('sliders').get();
        const newData = response.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            }
        })
        res.status(200).send(newData);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/getWodList", async (req, res) => {
    try {
        const response = await admin.firestore().collection('workouts_wod').get();
        const newData = response.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            }
        })
        res.status(200).send(newData);
    } catch (error) {
        res.status(400).send(error);
    }
});


app.get("/getOrders", async (req, res) => {
    let orderList = [];

    await admin.database().ref("orders").once("value")
        .then((child) => {
            child.forEach(item => {
                orderList.push({
                    ...item.val(),
                    id: item.key
                });

            })
        })
        .catch((error) => res.status(400).send(error));
    res.status(200).send(orderList);
});

app.get("/getUserCount", async (req, res) => {
    let UserCount = 0;
    await admin.database().ref("users").once("value")
        .then((snapshot) => {
            UserCount = (snapshot.numChildren());
            res.status(200).send(snapshot.numChildren());
        })
        .catch((error) => res.status(400).send(error));
});

app.get("/getwodc", async (req, res) => {
    await admin.database().ref("workouts_wod").once("value")
        .then((snapshot) => {
            res.status(200).send(snapshot.val());
        })
        .catch((error) => res.status(400).send(error));
});

app.get("/getwc", async (req, res) => {
    await admin.database().ref("workouts").once("value")
        .then((snapshot) => {
            res.status(200).send(snapshot.val());
        })
        .catch((error) => res.status(400).send(error));
});

app.get("/getfc", async (req, res) => {
    await admin.database().ref("foods").once("value")
        .then((snapshot) => {
            res.status(200).send(snapshot.val());
        })
        .catch((error) => res.status(400).send(error));
});

app.get("/allAuthUser", async (req, res) => {
    let ListClaimsAdmin = []
    admin
        .auth()
        .listUsers()
        .then((listUsersResult) => {
            listUsersResult.users.forEach((userRecord) => {
                if (userRecord.customClaims ? (userRecord.customClaims.admin === true ? true : false) : false) {
                    ListClaimsAdmin.push(userRecord.toJSON())
                }
            });
            res.send(ListClaimsAdmin)
        })
        .catch(() => {
            res.status(201).send(false)
        });
})

app.post("/createAdmin", async (req, res) => {
    let { email, adminpass } = req.body.data

    await admin.auth().createUser(
        {
            email: email,
            emailVerified: false,
            password: adminpass,
            disabled: false,
        }
    ).then(async (result) => {
        await admin.auth().setCustomUserClaims(result.uid, { admin: true })
        res.status(200).send(true)
    }).catch(() => {
        res.status(201).send(false);
    })
})

app.post("/deleteUser", async (req, res) => {
    await admin.database().ref("users").child(req.body.id).remove()
        .then(() => {
            admin.auth().deleteUser(req.body.id)
                .then((res) => {
                    res.status(200).send(res);
                })
                .catch((error) => {
                    res.status(400).send(error);
                });
        })
        .catch((error) => {
            res.status(400).send(error);
        });
});

app.post("/updateUser", async (req, res) => {
    await admin.database().ref(`users/${req.body.id}`).update(req.body.data)
        .then(() => {
            res.status(200).send(true);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
});

app.get("/getWods", async (req, res) => {
    let wodList = [];

    await admin.database().ref("workouts_wod").once("value")
        .then((child) => {
            child.forEach(item => {
                wodList.push({
                    ...item.val(),
                    id: item.key
                });

            })
        })
        .catch((error) => res.status(400).send(error));
    res.status(200).send(wodList);
});


app.post("/deleteWod", async (req, res) => {
    await admin
        .database().ref(`workouts_wod/${req.body.workoutId}`).remove()
        .then(() => {
            res.status(200).send(true);
        })
        .catch((error) => res.status(201).send(error));
});

app.post("/getUsertestlist", async (req, res) => {
    let testList = [];
    await admin.database().ref(`users_points/${req.body.userId}`).orderByChild('dataType').equalTo('exam').once("value")
        .then((snapshot) => {
            if (snapshot.val() !== undefined && snapshot.val() !== null) {
                snapshot.forEach((item) => {
                    testList.push({
                        ...item.val(),
                        id: item.key
                    });
                })
                res.status(200).send(testList);
            } else {
                res.status(200).send(testList);
            }
        })
        .catch((error) => {
            res.status(400).send(error)
        })
});

app.post("/getUsermezuralist", async (req, res) => {
    var measurementsList = [];

    await admin.database().ref(`users/${req.body.userId}/measurements`).once("value")
        .then((snapshot) => {
            if (snapshot.val() !== undefined && snapshot.val() !== null) {
                snapshot.forEach((item) => {
                    measurementsList.push({
                        ...item.val(),
                        id: item.key
                    });
                })

                res.status(200).send(measurementsList);
                setLoading(false);
            } else {
                res.status(200).send([]);
            }
        })
        .catch((err) => {
            res.status(400).send(err)
        })
});

//END ADMIN PANEL


app.post("/createNewUser", async (req, res) => {
    await admin.auth().createUser({
        email: req.body.data.email,
        emailVerified: true,
        password: req.body.password,
        disabled: false,
        displayName: req.body.data.name
    }).then((userRecord) => {
        admin.database().ref("users").child(userRecord.uid).set(req.body.data)
            .then(() => {
                res.status(200).send({ status: true, userData: userRecord });
            })
            .catch((error) => {
                res.status(201).send(error);
            });
    }).catch((error) => {
        res.status(201).send(String(error));
    })

});

app.post("/createUser", async (req, res) => {
    await admin.auth().createUser({
        email: req.body.data.email,
        emailVerified: true,
        password: req.body.password,
        disabled: false,
        displayName: req.body.data.name
    }).then((userRecord) => {
        admin.database().ref("users").child(userRecord.uid).set(req.body.data)
            .then(() => {
                res.status(200).send({ status: true, userData: userRecord });
            })
            .catch((error) => {
                res.status(201).send(error);
            });
    }).catch((error) => {
        res.status(201).send(String(error));
    })
});

app.post("/updateUserData", async (req, res) => {
    admin.database().ref("users" + '/' + req.body.uid).update(req.body.data)
        .then(() => {
            res.status(200).send(true);
        }).catch((error) => {
            res.status(201).send(String(error));
        })

});


app.post("/getUserData", async (req, res) => {
    admin.database().ref("users" + '/' + req.body.uid).once('value')
        .then((snapshot) => {
            res.status(200).send({ userData: snapshot.val() });
        }).catch((error) => {
            res.status(201).send(String(error));
        })

});

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

app.get("/getUsers", async (req, res) => {
    let userList = [];
    await admin.database().ref("users").once('value')
        .then((userSnap) => {
            userSnap.forEach((item) => {
                userList.push({
                    ...item.val(),
                    id: item.key
                })
            })
        })
        .catch((error) => res.status(201).send(error));
    res.status(200).send(userList);
});


app.get("/getWorkouts", async (req, res) => {
    let workoutList = [];
    await admin.database().ref("workouts").once('value')
        .then((workSnap) => {
            workSnap.forEach((item) => {
                workoutList.push({
                    ...item.val(),
                    id: item.key
                })
            })
        })
        .catch((error) => res.status(201).send(error));
    res.status(200).send(workoutList);
});

app.post("/addWorkout", async (req, res) => {
    await admin
        .database().ref("workouts").push(req.body)
        .then(() => {
            res.status(200).send(true);
        })
        .catch((error) => res.status(201).send(error));
});

app.post("/updateWorkout", async (req, res) => {
    await admin
        .database().ref(`workouts/${req.body.workoutId}`).update(req.body.workoutData)
        .then(() => {
            res.status(200).send(true);
        })
        .catch((error) => res.status(201).send(error));
});

app.get("/getFoods", async (req, res) => {
    let foodList = [];
    await admin.database().ref("foods").once('value')
        .then((foodSnap) => {
            foodSnap.forEach((item) => {
                foodList.push({
                    ...item.val(),
                    id: item.key
                })
            })
        })
        .catch((error) => res.status(201).send(error));
    res.status(200).send(foodList);
});

app.post("/addFood", async (req, res) => {
    await admin
        .database().ref("foods").push(req.body.foodValues)
        .then(() => {
            res.status(200).send(true);
        })
        .catch((error) => res.status(201).send(error));
});

app.post("/updateFood", async (req, res) => {
    await admin
        .database().ref('foods').child(req.body.foodId).update(req.body.foodData)
        .then(() => {
            res.status(200).send(true);
        })
        .catch((error) => res.status(201).send(error));
});

app.post("/deleteFood", async (req, res) => {
    await admin
        .database().ref(`foods/${req.body.foodId}`).remove()
        .then(() => {
            res.status(200).send(true);
        })
        .catch((error) => res.status(201).send(error));
});

app.post("/deleteWorkout", async (req, res) => {
    await admin
        .database().ref(`workouts/${req.body.workoutId}`).remove()
        .then(() => {
            res.status(200).send(true);
        })
        .catch((error) => res.status(201).send(error));
});

app.post("/sendPost", async (req, res) => {
    await admin
        .database().ref("feed").push(req.body.data)
        .then(() => {
            res.status(200).send(true);
        })
        .catch((error) => res.status(201).send(error));
});

exports.app = functions.https.onRequest(app);