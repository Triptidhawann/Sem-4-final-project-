const express = require('express');
const router = express.Router();
const { getRequests, createRequest, updateRequestStatus, updateRequest, deleteRequest } = require('../controllers/requestController');

router.route('/')
    .get(getRequests)
    .post(createRequest);

router.route('/:id')
    .patch(updateRequestStatus)
    .put(updateRequest)
    .delete(deleteRequest);

module.exports = router;
