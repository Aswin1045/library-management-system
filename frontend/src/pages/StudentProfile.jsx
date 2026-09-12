import React, { useState, useEffect, useContext } from 'react';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { Spinner, ErrorMessage } from '../components/ui/Feedback';

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await client.get(`/students/${user.id}/profile`);
      setProfile(res.data);
    } catch (err) {
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProfile} />;
  if (!profile) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: 'var(--space-xl)' }}>My Profile</h2>
      <div className="card">
        <h3 className="serif" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          Account Details
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
          <strong style={{ color: 'var(--text-muted)' }}>Name:</strong>
          <span>{profile.name}</span>
          
          <strong style={{ color: 'var(--text-muted)' }}>Email:</strong>
          <span>{profile.email}</span>
          
          <strong style={{ color: 'var(--text-muted)' }}>Department:</strong>
          <span>{profile.department}</span>
          
          <strong style={{ color: 'var(--text-muted)' }}>Total Borrows:</strong>
          <span>{profile.borrowRecords ? profile.borrowRecords.length : 0} books historically</span>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
