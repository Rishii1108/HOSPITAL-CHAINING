const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const { auth } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Get all hospitals with filters
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate('specializations', 'name');
    const formattedHospitals = hospitals.map(hospital => ({
      _id: hospital._id, // ID at the top
      name: hospital.name,
      description: hospital.description,
      chain: hospital.chain,
      contactInfo: hospital.contactInfo,
      specializations: hospital.specializations.map(spec => spec.name),
      photos: hospital.photos.map(photo => ({
        url: photo.url,
        caption: photo.caption
      })),
      createdAt: hospital.createdAt,
      updatedAt: hospital.updatedAt,
      location: hospital.location
    }));
    res.json(formattedHospitals);
  } catch (error) {
    console.error('Get hospitals error:', error);
    res.status(500).json({ message: 'Error fetching hospitals' });
  }
});


// Get single hospital
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate('specializations', 'name');
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    res.json({
      _id: hospital._id, 
      name: hospital.name,
      description: hospital.description,
      chain: hospital.chain,
      contactInfo: hospital.contactInfo,
      specializations: hospital.specializations.map(spec => spec.name),
      photos: hospital.photos.map(photo => ({
        url: photo.url,
        caption: photo.caption
      })),
      createdAt: hospital.createdAt,
      updatedAt: hospital.updatedAt,
      location: hospital.location
    });
  } catch (error) {
    console.error('Get hospital by id error:', error);
    res.status(500).json({ message: 'Error fetching hospital' });
  }
});

// Create hospital (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    await hospital.populate('specializations', 'name');

    res.status(201).json({
      _id: hospital._id,
      name: hospital.name,
      description: hospital.description,
      chain: hospital.chain,
      contactInfo: hospital.contactInfo,
      specializations: hospital.specializations.map(spec => spec.name),
      photos: hospital.photos.map(photo => ({
        url: photo.url,
        caption: photo.caption
      })),
      createdAt: hospital.createdAt,
      updatedAt: hospital.updatedAt,
      location: hospital.location
    });
  } catch (error) {
    console.error('Hospital creation error:', error);
    res.status(500).json({ message: 'Error creating hospital' });
  }
});

// Update hospital (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('specializations', 'name');

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json({
      _id: hospital._id,
      name: hospital.name,
      description: hospital.description,
      chain: hospital.chain,
      contactInfo: hospital.contactInfo,
      specializations: hospital.specializations.map(spec => spec.name),
      photos: hospital.photos.map(photo => ({
        url: photo.url,
        caption: photo.caption
      })),
      createdAt: hospital.createdAt,
      updatedAt: hospital.updatedAt,
      location: hospital.location
    });
  } catch (error) {
    console.error('Update hospital error:', error);
    res.status(500).json({ message: 'Error updating hospital' });
  }
});

// Delete hospital (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting hospital' });
  }
});

module.exports = router;