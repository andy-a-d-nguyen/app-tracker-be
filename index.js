import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router.js';

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN_URL;
const port = process.env.SERVER_PORT;

mongoose
	.connect('mongodb://localhost:27017/appTracker')
	.then(() => console.log('connected'))
	.catch((err) => console.error(err));
mongoose.connection.on('error', (err) => console.error(err));

app.use(cors({origin: clientOrigin}));
app.use(express.json());
app.use(router);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
