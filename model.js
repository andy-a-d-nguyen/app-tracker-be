import mongoose from 'mongoose';

const { Schema } = mongoose;

const jobPostingSchema = new Schema({
	jobPostingURL: String,
	jobTitle: String,
	jobLocation: String,
	notes: String,
	applied: Boolean,
	interviewed: Boolean,
	offered: Boolean,
	offerAccepted: Boolean,
	noResponse: Boolean,
	rejected: Boolean,
});

const userSchema = new Schema({
	username: String,
	jobsApplied: [jobPostingSchema],
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
const User = mongoose.model('User', userSchema);

export { JobPosting, User };
