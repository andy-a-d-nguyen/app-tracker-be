import express from 'express';
import User from './model.js';

const router = express.Router();

router.get('/', (req, res) => {
	res.send('Hello World');
});

// create user
router.post('/user', async (req, res) => {
	if (await User.exists({ username: req.body.username })) {
		res.status(400).send('Duplicate username');
	} else {
		await User.create({
			username: req.body.username,
			jobsApplied: [],
		})
			.then(() => res.status(200).end())
			.catch((error) => res.status(500).send(error));
	}
});

// get user
router.get('/user', (req, res) => {
	User.find({ username: req.query.username }, (err, doc) => {
		if (err) {
			res.status(404).end();
		} else {
			res.send(doc);
		}
	});
});

// delete user
router.delete('/user/:id', (req, res) => {});

// create job
router.post('/user/:id/jobs', (req, res) => {});

// get jobs
router.get('/user/:id/jobs', (req, res) => {});

// update job
router.put('/user/:id/jobs/:id', (req, res) => {});

// delete job
router.delete('/user/:id/jobs/:id', (req, res) => {});

export default router;
