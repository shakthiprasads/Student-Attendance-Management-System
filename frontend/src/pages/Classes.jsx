import { useState, useEffect } from 'react';
import { classService } from '../services/api';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    subjects: []
  });
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classService.getAll();
      setClasses(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await classService.update(editingClass._id, formData);
      } else {
        await classService.create(formData);
      }
      fetchClasses();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save class');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await classService.delete(id);
        fetchClasses();
      } catch (err) {
        setError('Failed to delete class');
      }
    }
  };

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData({ ...formData, subjects: [...formData.subjects, newSubject.trim()] });
      setNewSubject('');
    }
  };

  const removeSubject = (subjectToRemove) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter(s => s !== subjectToRemove)
    });
  };

  const openModal = (classItem = null) => {
    if (classItem) {
      setEditingClass(classItem);
      setFormData({
        name: classItem.name,
        section: classItem.section,
        subjects: classItem.subjects || []
      });
    } else {
      setEditingClass(null);
      setFormData({ name: '', section: 'A', subjects: [] });
    }
    setNewSubject('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClass(null);
    setFormData({ name: '', section: 'A', subjects: [] });
    setNewSubject('');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Classes</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          Add Class
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {classes.length === 0 ? (
        <div className="empty-state">No classes found. Add your first class!</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Section</th>
              <th>Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem._id}>
                <td>{classItem.name}</td>
                <td>{classItem.section}</td>
                <td>
                  {classItem.subjects && classItem.subjects.length > 0 
                    ? classItem.subjects.join(', ') 
                    : 'No subjects'}
                </td>
                <td className="actions">
                  <button className="btn btn-primary" onClick={() => openModal(classItem)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(classItem._id)}>
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
            <h3>{editingClass ? 'Edit Class' : 'Add Class'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Grade 10, CS101"
                  required
                />
              </div>
              <div className="form-group">
                <label>Section</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="e.g., A, B, C"
                />
              </div>
              <div className="form-group">
                <label>Subjects</label>
                <div className="subject-input-row">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                    placeholder="e.g., Mathematics, Physics"
                  />
                  <button type="button" className="btn btn-primary" onClick={addSubject}>
                    Add
                  </button>
                </div>
                {formData.subjects.length > 0 && (
                  <div className="subject-tags">
                    {formData.subjects.map((subject, index) => (
                      <span key={index} className="subject-tag">
                        {subject}
                        <button type="button" onClick={() => removeSubject(subject)}>&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClass ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classes;
