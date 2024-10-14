import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

// Define the data schema
const dataSchema = new mongoose.Schema({
    branchCode: String,
    subBranchCode: String,
    renownedPlace: String,
    latitude: Number,
    longitude: Number,
});

// Create a Mongoose model
const Data = mongoose.models.Data || mongoose.model('Data', dataSchema);

// MongoDB connection
async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) return; // If already connected
    await mongoose.connect('mongodb://localhost:27017/BangladeshBankProject');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    if (req.method === 'POST') {
        const { branchCode, subBranchCode, renownedPlace, latitude, longitude } = req.body;

        try {
            const newData = new Data({ branchCode, subBranchCode, renownedPlace, latitude, longitude });
            await newData.save();
            res.status(201).json({ message: 'Data saved successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error saving data', error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
