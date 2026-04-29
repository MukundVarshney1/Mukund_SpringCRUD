import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', course: '' });
  const [editingId, setEditingId] = useState(null);
  
  // New Interactive States
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const API_URL = 'http://localhost:8080/students';

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      showToast("Error connecting to server!");
    }
  };

  // Helper function to show notifications
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000); // Disappear after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading animation
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      setFormData({ name: '', email: '', course: '' });
      setEditingId(null);
      await fetchStudents();
      
      showToast(editingId ? 'Student updated successfully!' : 'Student added successfully!');
    } catch (error) {
      showToast('Error saving data!');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleEdit = (s) => {
    setFormData({ name: s.name, email: s.email, course: s.course });
    setEditingId(s.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    await fetchStudents();
    showToast('Student removed.');
  };

  // Filter students based on the search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      
      {/* Toast Notification Pop-up */}
      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}

      <div className="card">
        <h2>{editingId ? 'Edit Student Details' : 'Register New Student'}</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <input 
            name="name" 
            placeholder="Student Name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <input 
            name="course" 
            placeholder="Enrolled Course" 
            value={formData.course} 
            onChange={(e) => setFormData({...formData, course: e.target.value})} 
            required 
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Student')}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline" disabled={isLoading} onClick={() => {setEditingId(null); setFormData({name:'', email:'', course:''})}}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Active Enrolled Students</h2>
        
        {/* Live Search Bar */}
        <input 
          type="text" 
          className="search-bar" 
          placeholder="🔍 Search by name, email, or course..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className="student-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(s => (
                <tr key={s.id}>
                  <td><strong>#{s.id}</strong></td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td><span style={{background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px'}}>{s.course}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-edit" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  {students.length === 0 ? "No students registered yet." : "No matching students found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;