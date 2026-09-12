import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ErrorMessage } from '../components/ui/Feedback';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', department: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerStudent } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerStudent(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="card">
        <h2>Student Registration</h2>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" className="form-control" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" className="form-control" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <input type="text" name="department" className="form-control" placeholder="Department (e.g. Computer Science)" value={formData.department} onChange={handleChange} required />
          <input type="password" name="password" className="form-control" placeholder="Password (min 6 characters)" value={formData.password} onChange={handleChange} required minLength="6" />
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ marginTop: 'var(--space-md)', textAlign: 'center', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
