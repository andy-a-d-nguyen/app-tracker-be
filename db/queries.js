import User from './model.js';

const findUser = (username, callback) => {
	User.exists({ username: username }).exec(callback);
};

const createUser = (username, callback) => {
	if (!User.exists({ username: username })) {
		return User.create({
			username: username,
			jobsApplied: [],
		}).exec(callback);
	}
};

export { createUser };
