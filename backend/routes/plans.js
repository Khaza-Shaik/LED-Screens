const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const auth = require('../middleware/auth');

// Get all plans
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find().sort('order');
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Server error fetching plans' });
  }
});

// Update a plan (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });

    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json(updatedPlan);
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: 'Server error updating plan' });
  }
});

module.exports = router;
