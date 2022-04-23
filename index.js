import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router.js';

const app = express();
const port = 3000;

mongoose
	.connect('mongodb://localhost:27017/appTracker')
	.then(() => console.log('connected'))
	.catch((err) => console.err(err));

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
