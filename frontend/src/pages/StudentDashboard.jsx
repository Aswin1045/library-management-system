import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Spinner, ErrorMessage, EmptyState } from '../components/ui/Feedback';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returningId, setReturningId] = useState(null);

  const fetchLoans = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await client.get('/borrow/mine');
      setLoans(res.data);
    } catch (err) {
      setError('Failed to load your loans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleReturn = async (recordId) => {
    setReturningId(recordId);
    try {
      await client.post('/return/' + recordId);
      fetchLoans();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to return book');
    } finally {
      setReturningId(null);
    }
  };

  const activeLoans = loans.filter(l => l.status === 'BORROWED');
  const pastLoans = loans.filter(l => l.status === 'RETURNED');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.h2 variants={itemVariants} style={{ marginBottom: 'var(--space-xl)' }}>My Dashboard</motion.h2>
      
      {error && <ErrorMessage message={error} onRetry={fetchLoans} />}

      {loading ? (
        <Spinner />
      ) : (
        <>
          <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-xxl)' }}>
            <h3 className="serif" style={{ marginBottom: 'var(--space-md)' }}>Active Loans ({activeLoans.length})</h3>
            {activeLoans.length === 0 ? (
              <EmptyState title="No active loans" description="You don't have any books currently borrowed." />
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th style={styles.th}>Book Title</th>
                      <th style={styles.th}>Borrowed On</th>
                      <th style={styles.th}>Due Date</th>
                      <th style={styles.th}>Fine</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLoans.map(loan => (
                      <tr key={loan.id} style={styles.tr}>
                        <td style={styles.td}><strong>{loan.book.title}</strong></td>
                        <td style={styles.td}>{loan.borrowDate}</td>
                        <td style={styles.td}>
                          {loan.dueDate}
                          {loan.overdue && <span style={styles.badgeOverdue}>Overdue</span>}
                        </td>
                        <td style={styles.td}>
                          {loan.fineAmount > 0 ? (
                            <span style={{ color: 'var(--danger)', fontWeight: '600' }}>{'$' + loan.fineAmount.toFixed(2)}</span>
                          ) : '$0.00'}
                        </td>
                        <td style={styles.td}>
                          <motion.button 
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-outline" 
                            style={{ padding: '4px 12px', fontSize: '0.85rem' }}
                            onClick={() => handleReturn(loan.id)}
                            disabled={returningId === loan.id}
                          >
                            {returningId === loan.id ? 'Returning...' : 'Return'}
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="serif" style={{ marginBottom: 'var(--space-md)' }}>Recently Returned</h3>
            {pastLoans.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No past borrowing history.</p>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th style={styles.th}>Book Title</th>
                      <th style={styles.th}>Borrowed On</th>
                      <th style={styles.th}>Returned On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastLoans.slice(0, 5).map(loan => (
                      <tr key={loan.id} style={styles.tr}>
                        <td style={styles.td}>{loan.book.title}</td>
                        <td style={styles.td}>{loan.borrowDate}</td>
                        <td style={styles.td}>{loan.returnDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: 'var(--surface-alt)',
    borderBottom: '1px solid var(--border)',
    textAlign: 'left',
  },
  th: {
    padding: 'var(--space-md)',
    fontWeight: 600,
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tr: {
    borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: 'var(--space-md)',
    verticalAlign: 'middle',
  },
  badgeOverdue: {
    backgroundColor: 'var(--danger-light)',
    color: 'var(--danger)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    marginLeft: '8px',
    fontWeight: 600,
  }
};

export default StudentDashboard;
