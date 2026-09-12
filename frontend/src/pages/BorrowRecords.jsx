import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Spinner, ErrorMessage } from '../components/ui/Feedback';

const BorrowRecords = () => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await client.get(`/borrow/records?page=${page}&size=10`);
      setRecords(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Failed to load borrow records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page]);

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--space-xl)' }}>All Borrow Records</h2>

      {error && <ErrorMessage message={error} onRetry={fetchRecords} />}

      {loading ? <Spinner /> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--surface-alt)' }}>
              <tr>
                <th style={styles.th}>Book Title</th>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Borrow Date</th>
                <th style={styles.th}>Due Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Fine</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={styles.td}><strong>{record.book?.title}</strong></td>
                  <td style={styles.td}>{record.student?.name}</td>
                  <td style={styles.td}>{record.borrowDate}</td>
                  <td style={styles.td}>{record.dueDate}</td>
                  <td style={styles.td}>
                    {record.status === 'BORROWED' ? (
                      <span style={{ color: record.overdue ? 'var(--danger)' : 'var(--accent)', fontWeight: 600 }}>
                        {record.overdue ? 'OVERDUE' : 'ACTIVE'}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>RETURNED</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {record.fineAmount > 0 ? (
                      <span style={{ color: 'var(--danger)', fontWeight: '600' }}>${record.fineAmount.toFixed(2)}</span>
                    ) : '$0.00'}
                  </td>
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

export default BorrowRecords;
