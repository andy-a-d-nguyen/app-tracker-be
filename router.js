import express from 'express';
import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import axios from 'axios';
import { parse, stringify } from 'flatted';
import User from './db/model.js';

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
router.post('/user', checkJwt, (req, res) => {
	User.findOne({ username: req.body.username }, async (err, user) => {
		if (err) {
			res.status(500).send(err);
		} else {
			if (user === null) {
				await User.create({
					username: req.body.username,
					jobsApplied: [],
				})
					.then((response) => {
						res.status(200).json(response);
					})
					.catch((error) => {
						res.status(500).send(error);
					});
			} else {
				res.status(200).json(user);
			}
		}
	});
});

// get Chuck Norris fact
router.get('/user', checkJwt, (_, res) => {
	axios
		.get('https://api.chucknorris.io/jokes/random')
		.then((response) => {
			res.status(200).json(response.data);
		})
		.catch((error) => {
			res.status(500).send(error);
		});
});

// delete user
router.delete('/user/:id', checkJwt, (req, res) => {
	User.findOne({ username: req.params.id }, async (err) => {
		if (err) {
			res.status(404).send(err);
		} else {
			await User.findOneAndDelete({ username: req.params.id })
				.then(() => {
					res.sendStatus(200);
				})
				.catch((error) => {
					res.status(500).send(error);
				});
		}
	});
});

// create job
router.post('/user/:id/jobs', checkJwt, (req, res) => {
	User.findOne({ username: req.params.id }, async (err, user) => {
		if (err) {
			res.status(500).send(err);
		} else {
			user.jobsApplied.push(req.body.job);
			await user
				.save()
				.then((updatedUser) => {
					res.status(200).json(updatedUser);
				})
				.catch((error) => {
					res.status(500).send(error);
				});
		}
	});
});

// update job
router.put('/user/:id/jobs/:index', checkJwt, async (req, res) => {
	User.findOne({ username: req.params.id }, async (err, user) => {
		if (err) {
			res.status(500).send(err);
		} else {
			user.jobsApplied[req.params.index] = req.body.job;
			await user
				.save()
				.then((updatedUser) => {
					res.status(200).json(updatedUser);
				})
				.catch((error) => {
					res.status(500).send(error);
				});
		}
	});
});

// delete job
router.delete('/user/:id/jobs/:index', checkJwt, (req, res) => {
	User.findOne({ username: req.params.id }, async (err, user) => {
		if (err) {
			res.status(500).send(err);
		} else {
			user.jobsApplied.splice(req.params.index, 1);
			await user
				.save()
				.then((updatedUser) => {
					res.status(200).json(updatedUser);
				})
				.catch((error) => {
					res.status(500).send(error);
				});
		}
	});
});

export default router;
