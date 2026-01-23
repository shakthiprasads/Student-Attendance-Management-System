import { useState, useEffect } from 'react';
import { attendanceService, studentService, classService } from '../services/api';

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    classId: '',
    subject: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [bulkAttendance, setBulkAttendance] = useState([]);

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  // When class is selected, populate bulk attendance list with all students of that class
  useEffect(() => {
    if (selectedClass) {
      const classStudents = students.filter(s => s.class?._id === selectedClass);
      setBulkAttendance(
        classStudents.map(student => ({
          studentId: student._id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          status: 'present',
          remarks: ''
        }))
      );
    } else {
      setBulkAttendance([]);
    }
  }, [selectedClass, students]);

  // Get subjects for selected class
  const getSelectedClassSubjects = () => {
    const cls = classes.find(c => c._id === selectedClass);
    return cls?.subjects || [];
  };

  // Get subjects for filter class
  const getFilterClassSubjects = () => {
    const cls = classes.find(c => c._id === filters.classId);
    return cls?.subjects || [];
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.classId) params.classId = filters.classId;
      if (filters.subject) params.subject = filters.subject;
      if (filters.date) params.date = filters.date;
      const response = await attendanceService.getAll(params);
      setAttendance(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentService.getAll();
      setStudents(response.data);
    } catch (err) {
      console.error('Failed to fetch students');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await classService.getAll();
      setClasses(response.data);
    } catch (err) {
      console.error('Failed to fetch classes');
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedSubject || bulkAttendance.length === 0) {
      setError('Please select a class, subject and ensure there are students');
      return;
    }
    try {
      await attendanceService.markBulk({
        classId: selectedClass,
        subject: selectedSubject,
        date: attendanceDate,
        records: bulkAttendance
      });
      fetchAttendance();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const handleBulkStatusChange = (studentId, status) => {
    setBulkAttendance(prev =>
      prev.map(item =>
        item.studentId === studentId ? { ...item, status } : item
      )
    );
  };

  const handleBulkRemarksChange = (studentId, remarks) => {
    setBulkAttendance(prev =>
      prev.map(item =>
        item.studentId === studentId ? { ...item, remarks } : item
      )
    );
  };

  const markAllAs = (status) => {
    setBulkAttendance(prev =>
      prev.map(item => ({ ...item, status }))
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await attendanceService.delete(id);
        fetchAttendance();
      } catch (err) {
        setError('Failed to delete attendance record');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await attendanceService.update(id, { status: newStatus });
      fetchAttendance();
    } catch (err) {
      setError('Failed to update attendance status');
    }
  };

  const openModal = () => {
    setSelectedClass(filters.classId || '');
    setSelectedSubject('');
    setAttendanceDate(filters.date || new Date().toISOString().split('T')[0]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClass('');
    setSelectedSubject('');
    setBulkAttendance([]);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'present': return 'status-badge status-present';
      case 'absent': return 'status-badge status-absent';
      case 'late': return 'status-badge status-late';
      default: return 'status-badge';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Attendance</h2>
        <button className="btn btn-primary" onClick={openModal}>
          Mark Attendance
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="filter-section">
        <div className="form-group">
          <label>Filter by Class</label>
          <select
            value={filters.classId}
            onChange={(e) => setFilters({ ...filters, classId: e.target.value, subject: '' })}
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.section}
              </option>
            ))}
          </select>
        </div>
        {filters.classId && getFilterClassSubjects().length > 0 && (
          <div className="form-group">
            <label>Filter by Subject</label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            >
              <option value="">All Subjects</option>
              {getFilterClassSubjects().map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group">
          <label>Filter by Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : attendance.length === 0 ? (
        <div className="empty-state">No attendance records found for the selected filters.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Student</th>
              <th>Roll Number</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record._id}>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.student?.name || 'N/A'}</td>
                <td>{record.student?.rollNumber || 'N/A'}</td>
                <td>{record.class ? `${record.class.name} - ${record.class.section}` : 'N/A'}</td>
                <td>{record.subject || 'N/A'}</td>
                <td>
                  <select
                    className={getStatusBadgeClass(record.status)}
                    value={record.status}
                    onChange={(e) => handleStatusChange(record._id, e.target.value)}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </td>
                <td>{record.remarks || '-'}</td>
                <td className="actions">
                  <button className="btn btn-danger" onClick={() => handleDelete(record._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal bulk-attendance-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Mark Attendance</h3>
            <form onSubmit={handleBulkSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setSelectedSubject('');
                    }}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} - {cls.section}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    required
                    disabled={!selectedClass}
                  >
                    <option value="">Select Subject</option>
                    {getSelectedClassSubjects().map((subject, index) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {selectedClass && selectedSubject && bulkAttendance.length > 0 && (
                <>
                  <div className="bulk-actions">
                    <span>Quick Actions:</span>
                    <button type="button" className="btn btn-success btn-sm" onClick={() => markAllAs('present')}>
                      All Present
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => markAllAs('absent')}>
                      All Absent
                    </button>
                  </div>

                  <div className="student-list">
                    <table className="bulk-table">
                      <thead>
                        <tr>
                          <th>Roll No</th>
                          <th>Student Name</th>
                          <th>Status</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkAttendance.map((item) => (
                          <tr key={item.studentId}>
                            <td>{item.rollNumber}</td>
                            <td>{item.studentName}</td>
                            <td>
                              <select
                                className={getStatusBadgeClass(item.status)}
                                value={item.status}
                                onChange={(e) => handleBulkStatusChange(item.studentId, e.target.value)}
                              >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.remarks}
                                onChange={(e) => handleBulkRemarksChange(item.studentId, e.target.value)}
                                placeholder="Remarks"
                                className="remarks-input"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {selectedClass && !selectedSubject && (
                <div className="empty-state">Please select a subject to mark attendance.</div>
              )}

              {selectedClass && selectedSubject && bulkAttendance.length === 0 && (
                <div className="empty-state">No students found in this class.</div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!selectedSubject || bulkAttendance.length === 0}
                >
                  Save Attendance ({bulkAttendance.length} students)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
