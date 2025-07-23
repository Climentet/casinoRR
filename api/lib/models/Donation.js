import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  whom: String,
  amount: Number,
  type: String,
});

export default mongoose.models.Donation ||
  mongoose.model('Donation', DonationSchema);