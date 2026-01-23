const Attendance = require('../models/Attendance');

// Get all attendance records
exports.getAttendance = async (req, res) => {
  try {
    const { classId, date, studentId, subject } = req.query;
    let filter = {};
    
    if (classId) filter.class = classId;
    if (studentId) filter.student = studentId;
    if (subject) filter.subject = subject;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }
    
    const attendance = await Attendance.find(filter)
      .populate('student')
      .populate('class')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single attendance record
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('student')
      .populate('class');
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create attendance record
exports.createAttendance = async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    const savedAttendance = await attendance.save();
    const populated = await savedAttendance.populate(['student', 'class']);
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark attendance for multiple students
exports.markBulkAttendance = async (req, res) => {
  try {
    const { classId, date, subject, records } = req.body;
    // records: [{ studentId, status, remarks }]
    
    const attendanceRecords = records.map(record => ({
      student: record.studentId,
      class: classId,
      subject: subject,
      date: new Date(date),
      status: record.status,
      remarks: record.remarks || ''
    }));
    
    const result = await Attendance.insertMany(attendanceRecords, { ordered: false });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update attendance record
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(['student', 'class']);
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete attendance record
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance report for a student
exports.getStudentReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendance = await Attendance.find({ student: studentId })
      .populate('class')
      .sort({ date: -1 });
    
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    
    res.json({
      records: attendance,
      summary: {
        total,
        present,
        absent,
        late,
        attendancePercentage: total > 0 ? ((present + late) / total * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
