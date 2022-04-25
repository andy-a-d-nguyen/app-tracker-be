import express from 'express';
import { JobPosting, User } from './model.js';

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
			.then(() => res.sendStatus(200))
			.catch((error) => res.status(500).send(error));
	}
});

// get user
router.get('/user/:id', async (req, res) => {
	await User.exists({ username: req.params.id })
		.then((user) => res.status(200).send(user))
		.catch(() => res.sendStatus(404));
});

// delete user
router.delete('/user/:id', async (req, res) => {
	await User.findOneAndDelete({ username: req.params.id })
		.then(() => res.sendStatus(200))
		.catch((err) => res.status(500).send(err));
});

// create job
router.post('/user/:id/jobs', async (req, res) => {
	await User.findOneAndUpdate(
		{ username: req.params.id },
		{ $push: { jobsApplied: req.body } },
		{ new: true }
	)
		.then(() => res.sendStatus(200))
		.catch((err) => res.status(500).send(err));
});

// get jobs
router.get('/user/:id/jobs', (req, res) => {});

// update job
router.put('/user/:id/jobs/:id', (req, res) => {});

// delete job
router.delete('/user/:id/jobs/:id', (req, res) => {});

export default router;
