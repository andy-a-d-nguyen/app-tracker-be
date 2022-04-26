import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { auth } from 'express-openid-connect';
import router from './router.js';

const app = express();
const port = 3000;

const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.SECRET,
	baseURL: 'http://localhost:3000',
	clientID: process.env.CLIENT_ID,
	issuerBaseURL: `https://${process.env.DOMAIN}`,
};

mongoose
	.connect('mongodb://localhost:27017/appTracker')
	.then(() => console.log('connected'))
	.catch((err) => console.error(err));
mongoose.connection.on('error', (err) => console.error(err));

app.use(cors());
app.use(express.json());
app.use(auth(config));
app.use(router);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
