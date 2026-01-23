const express = require('express');
const router = express.Router();
const {
  getAttendance,
  getAttendanceById,
  createAttendance,
  markBulkAttendance,
  updateAttendance,
  deleteAttendance,
  getStudentReport
} = require('../controllers/attendanceController');

router.route('/')
  .get(getAttendance)
  .post(createAttendance);

router.route('/bulk')
  .post(markBulkAttendance);

router.route('/report/:studentId')
  .get(getStudentReport);

router.route('/:id')
  .get(getAttendanceById)
  .put(updateAttendance)
  .delete(deleteAttendance);

module.exports = router;
