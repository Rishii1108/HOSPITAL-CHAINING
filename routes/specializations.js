const express = require('express');
const router = express.Router();
const Specialization = require('../models/Specialization');
const Hospital = require('../models/Hospital');
const { auth } = require('../middleware/auth');

// Get all specializations
router.get('/', async (req, res) => {
  try {
    const specializations = await Specialization.find().sort({ name: 1 });
    res.json(specializations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching specializations' });
  }
});

// Get single specialization
router.get('/:id', async (req, res) => {
  try {
    const specialization = await Specialization.findById(req.params.id);
    
    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }

    res.json(specialization);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching specialization' });
  }
});

// Create specialization (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const specialization = new Specialization(req.body);
    await specialization.save();
    res.status(201).json(specialization);
  } catch (error) {
    console.error('Create specialization error:', error);
    res.status(500).json({ message: 'Error creating specialization' });
  }
});

// Update specialization (admin only)
router.put('/:id', auth, async (req, res) => { 
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const specialization = await Specialization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }

    res.json(specialization);
  } catch (error) {
    res.status(500).json({ message: 'Error updating specialization' });
  }
});

// Delete specialization (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const specialization = await Specialization.findByIdAndDelete(req.params.id);
    
    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }

    res.json({ message: 'Specialization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting specialization' });
  }
});

// GET /api/hospitals/search?specialization=Cardiology
// router.get('/search', async (req, res) => {
//   try {
//     const { specialization } = req.query;
//     const spec = await Specialization.findOne({ name: specialization });
//     if (!spec) return res.json([]); // No such specialization

//     const hospitals = await Hospital.find({ specializations: spec._id }).populate('specializations', 'name');
//     res.json(hospitals);
//   } catch (error) {
//     res.status(500).json({ message: 'Error searching hospitals' });
//   }
// });

module.exports = router;