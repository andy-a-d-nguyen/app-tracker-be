import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	res.send('Hello World');
});

router.get('/:id', (req, res) => {
	res.send(`${req.params}`);
});

export default router;
