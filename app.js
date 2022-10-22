const express = require('express')
const mongoose = require("mongoose");
const session = require('express-session')
const cors = require('cors')
const calculation = require('./routes/calculations')

const {MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET} = require("./config/config");

const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
	mongoose
		.connect(mongoURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		.then(() => console.log("successfully connect to database"))
		.catch((e) => {
			console.log(e)
			setTimeout(connectWithRetry, 5000)
		})
}

connectWithRetry()
app.enable('trust proxy')

app.use(cors({}))

app.use(express.json())

app.use('/api/v1/calculations', calculation)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`))