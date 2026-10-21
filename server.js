/**
 * Midterm API Project - COMP229
 * Implement the six equipment API endpoints described in README.md.
 * Use the array index as the ID: index 0 is the first equipment item.
 * Add exactly two personalized items to the five supplied below.
 */
import express from 'express';

const app = express();
app.use(express.json());

let equipment = [
  { name: 'USB Microphone', category: 'audio', brand: 'AudioLab', year: 2021, quantity: 5 },
  { name: 'LED Panel', category: 'lighting', brand: 'BrightWorks', year: 2022, quantity: 4 },
  { name: 'Network Switch', category: 'networking', brand: 'NetCore', year: 2020, quantity: 3 },
  { name: 'Cable Tester', category: 'tools', brand: 'TestPro', year: 2019, quantity: 6 },
  { name: 'Studio Headphones', category: 'audio', brand: 'SoundCraft', year: 2023, quantity: 8 },
  // Personalized additions from 2010-2019 as my Student ID ends in 5
  {
    name: 'iPhone XS Max',
    category: 'phone',
    brand: 'Apple',
    year: 2018,
    quantity: 3
  },
  {
    name: 'Oculus Rift',
    category: 'vr',
    brand: 'Meta',
    year: 2016,
    quantity: 2
  }
];

// Validate equipment item
function isValidEquipment(item) {
  return item !== null &&
    typeof item === 'object' &&
    !Array.isArray(item) &&
    typeof item.name === 'string' &&
    typeof item.category === 'string' &&
    typeof item.brand === 'string' &&
    Number.isInteger(item.year) &&
    Number.isInteger(item.quantity) &&
    item.year > 0 &&
    item.quantity >= 0;
}

// Validate array index
function getValidIndex(id) {
  if (!/^(0|[1-9]\d*)$/.test(id)) {
    return -1;
  }

  const index = Number(id);

  if (!Number.isSafeInteger(index) ||
      index >= equipment.length) {
    return -1;
  }

  return index;
}

// 1. GET - Retrieve all equipment
app.get('/api/equipment', (req, res) => {
  res.status(200).json(equipment);
});

// 2. GET - Filter equipment by category *This route must come before /:id*
app.get('/api/equipment/filter', (req, res) => {
  const category = req.query.category;

  if (typeof category !== 'string' ||
      category.trim() === '') {
    return res.status(400).json({
      message: 'Category is required'
    });
  }

  const filteredEquipment = equipment.filter(item =>
    item.category.toLowerCase() ===
    category.trim().toLowerCase()
  );

  res.status(200).json(filteredEquipment);
});

// 3. GET - Retrieve equipment by ID
app.get('/api/equipment/:id', (req, res) => {
  const id = getValidIndex(req.params.id);

  if (id === -1) {
    return res.status(404).json({
      message: 'Equipment not found'
    });
  }

  res.status(200).json(equipment[id]);
});

// 4. POST - Add new equipment
app.post('/api/equipment', (req, res) => {
  const newEquipment = req.body;

  if (!isValidEquipment(newEquipment)) {
    return res.status(400).json({
      message: 'Invalid equipment data'
    });
  }

  equipment.push(newEquipment);

  res.status(201).json({
    message: 'Equipment added successfully',
    equipment: newEquipment
  });
});

// 5. PUT - Update equipment by ID
app.put('/api/equipment/:id', (req, res) => {
  const id = getValidIndex(req.params.id);

  if (id === -1) {
    return res.status(404).json({
      message: 'Equipment not found'
    });
  }

  if (!isValidEquipment(req.body)) {
    return res.status(400).json({
      message: 'Invalid equipment data'
    });
  }

  equipment[id] = req.body;

  res.status(200).json({
    message: 'Equipment updated successfully',
    equipment: equipment[id]
  });
});

// 6. DELETE - Remove equipment by ID
app.delete('/api/equipment/:id', (req, res) => {
  const id = getValidIndex(req.params.id);

  if (id === -1) {
    return res.status(404).json({
      message: 'Equipment not found'
    });
  }

  const deletedEquipment = equipment.splice(id, 1);

  res.status(200).json({
    message: 'Equipment deleted successfully',
    equipment: deletedEquipment[0]
  });
});

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', err => {
  if (err) {
    console.error(`Cannot start on port ${PORT}: ${err.message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});