import "reflect-metadata"
import express, { Application } from "express"
import morgan from "morgan"

import cors from "cors"
const PORT = process.env.PORT || 8000

const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))
app.use(express.static("public"))

var admin = require("firebase-admin")

var serviceAccount = require("../iotable.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iotable-852f0-default-rtdb.asia-southeast1.firebasedatabase.app",
})

var adminDatabase = admin.database()

app.put("/addNewEntry", (req, res) => {
  admin
    .auth()
    .getUserByEmail(req.body.email)
    .then(async function (userRecord: any) {
      req.body.macId
      req.body.senderUid

      /**
       * 3 things: targetEmail, currentUserUid, macId
       * validate and get uid of targetEmail.
       * append to users/targetUid/requests {`${macId}:{accepted, macId, requestedBy}}
       * append to users/currentUserUid/tables/{`${macId}`:{macId: string}}
       * append tables/${macId}:{macId, usedBy, users:${currentUserUid}:{name, currentUserUid}}
       */
      // See the tables above for the contents of userRecord
      console.log("Successfully fetched user data:", userRecord.uid)
      const targetUid = userRecord.uid
      const macIdGiven = req.body.macId
      const currentUserUid = req.body.uid

      let name: string = ""

      await adminDatabase.ref(`users/${currentUserUid}/name`).once("value", (data: any) => {
        console.log("inside the arrow:", data.val())
        name = data.val()
      })

      console.log("the name", name)
      const usersRef = adminDatabase.ref(`users/${targetUid}/requests`)
      usersRef.update({
        [macIdGiven]: {
          accepted: false,
          macId: macIdGiven,
          requestedBy: req.body.email,
        },
      })

      const usersTablesRef = adminDatabase.ref(`users/${currentUserUid}/tables`)
      usersTablesRef.update({
        [macIdGiven]: {
          macId: macIdGiven,
        },
      })
      const tablesRef = adminDatabase.ref(`tables`)
      tablesRef.update({
        [macIdGiven]: {
          macId: macIdGiven,
          usedBy: "",
          users: {
            [currentUserUid]: {
              name: name,
              uid: currentUserUid,
            },
          },
        },
      })
      res.sendStatus(200)
    })
    .catch(function (e: unknown) {
      console.log("Error fetching user data:", e as Error)
      res.sendStatus(400)
    })
  console.log(req)
})

app.listen(PORT, () => {
  console.log("Server is running on port", PORT)
})
