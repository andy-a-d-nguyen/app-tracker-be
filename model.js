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

const appTrackerSchema = new Schema({
	username: String,
	jobsApplied: [jobPostingSchema],
});

const JobPostingModel = mongoose.model('JobPosting', jobPostingSchema);
const AppTrackerModel = mongoose.model('AppTracker', appTrackerSchema);
