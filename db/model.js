import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const { Schema } = mongoose;

const userSchema = new Schema({
	username: String,
	jobsApplied: [],
});

const User = mongoose.model('User', userSchema);

export default User;
