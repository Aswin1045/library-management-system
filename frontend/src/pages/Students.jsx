import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Spinner, ErrorMessage } from '../components/ui/Feedback';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await client.get(`/students?page=${page}&size=10`);
      setStudents(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--space-xl)' }}>Manage Students</h2>
      
      {error && <ErrorMessage message={error} onRetry={fetchStudents} />}

      {loading ? <Spinner /> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--surface-alt)' }}>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Department</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={styles.td}>{student.id}</td>
                  <td style={styles.td}><strong>{student.name}</strong></td>
                  <td style={styles.td}>{student.email}</td>
                  <td style={styles.td}>{student.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)' }}>
          <button className="btn btn-outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
          <button className="btn btn-outline" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  th: { padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' },
  td: { padding: 'var(--space-md)' }
};

export default Students;
