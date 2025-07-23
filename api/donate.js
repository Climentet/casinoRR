// api/donate.js

import dbConnect from 'lib/mongodb';
import Donation from 'lib/models/Donation';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    await dbConnect();
    const { whom, amount, type } = req.body;

    try {
      const donation = await Donation.create({ whom, amount, type });
      res.status(200).json({ message: 'Donación guardada', donation });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'No se pudo guardar la donación' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

