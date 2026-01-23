import { useState, useEffect } from 'react';
import { studentService, classService } from '../services/api';

function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    class: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAll();
      setStudents(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentService.update(editingStudent._id, formData);
      } else {
        await studentService.create(formData);
      }
      fetchStudents();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(id);
        fetchStudents();
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  const openModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        class: student.class?._id || ''
      });
    } else {
      setEditingStudent(null);
      setFormData({ name: '', email: '', rollNumber: '', class: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({ name: '', email: '', rollNumber: '', class: '' });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Students</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          Add Student
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {students.length === 0 ? (
        <div className="empty-state">No students found. Add your first student!</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.rollNumber}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.class ? `${student.class.name} - ${student.class.section}` : 'N/A'}</td>
                <td className="actions">
                  <button className="btn btn-primary" onClick={() => openModal(student)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(student._id)}>
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingStudent ? 'Edit Student' : 'Add Student'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="student name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@gmail.com"
                  pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                  title="Email must be a valid @gmail.com address"
                  required
                />
              </div>
              <div className="form-group">
                <label>Roll Number</label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })}
                  placeholder="PES1PG25CSXXX"
                  pattern="^PES1PG25CS[0-9]{3}$"
                  title="Roll number must be in format PES1PG25CSXXX where XXX are digits (000-999)"
                  required
                />
              </div>
              <div className="form-group">
                <label>Class</label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} - {cls.section}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
