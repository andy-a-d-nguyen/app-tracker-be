import express from 'express';
import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import User from './model.js';

const router = express.Router();
const audience = process.env.AUTH0_AUDIENCE;
const domain = process.env.AUTH0_DOMAIN;

const checkJwt = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${domain}/.well-known/jwks.json`,
	}),

	audience: audience,
	issuer: `https://${domain}/`,
	algorithms: ['RS256'],
});

// create user
router.post('/user', checkJwt, async (req, res) => {
	if (!User.exists({ username: req.body.username })) {
		await User.create({
			username: req.body.username,
			jobsApplied: [],
		})
			.then((user) => res.status(200).send(user))
			.catch((err) => res.status(500).send(err));
	}
});

// get user
router.get('/user/:id', checkJwt, async (req, res) => {
	if ((await User.exists({ username: req.params.id })) == null) {
		res.sendStatus(404);
	} else {
		await User.findOne({ username: req.params.id })
			.then((user) => res.status(200).send(user))
			.catch((err) => res.status(500).send(err));
	}
});

// delete user
router.delete('/user/:id', async (req, res) => {
	if ((await User.exists({ username: req.params.id })) == null) {
		res.sendStatus(404);
	} else {
		await User.findOneAndDelete({ username: req.params.id })
			.then(() => res.sendStatus(200))
			.catch((err) => res.status(500).send(err));
	}
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

// update job
router.put('/user/:id/jobs/:index', async (req, res) => {
	User.findOne({ username: req.params.id }, async (err, user) => {
		if (err) res.status(500).send(err);
		else {
			user.jobsApplied[req.params.index] = req.body;
			await user
				.save()
				.then(() => res.sendStatus(200))
				.catch((error) => res.status(500).send(error));
		}
	});
});

// delete job
router.delete('/user/:id/jobs/:index', (req, res) => {
	User.findOne({ username: req.params.id }, async (err, user) => {
		if (err) res.status(500).send(err);
		else {
			user.jobsApplied.splice(req.params.index, 1);
			await user
				.save()
				.then(() => res.sendStatus(200))
				.catch((error) => res.status(500).send(error));
		}
	});
});

export default router;
