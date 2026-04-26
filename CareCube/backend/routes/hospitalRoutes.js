const express = require('express');
const router = express.Router();
const { getHospitals, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitalController');

router.route('/')
    .get(getHospitals)
    .post(createHospital);

router.route('/:id')
    .put(updateHospital)
    .delete(deleteHospital);

module.exports = router;
