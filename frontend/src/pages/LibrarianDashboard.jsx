import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Spinner, ErrorMessage } from '../components/ui/Feedback';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';

const AnimatedNumber = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return animation.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
};

const LibrarianDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await client.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--space-xl)' }}>Librarian Dashboard</h2>
      
      {error && <ErrorMessage message={error} onRetry={fetchStats} />}
      
      {loading ? <Spinner /> : stats && (
        <motion.div style={styles.grid} variants={containerVariants} initial="hidden" animate="show">
          <motion.div className="card" style={styles.statCard} variants={cardVariants}>
            <div style={styles.statTitle}>Total Books</div>
            <div style={styles.statValue}><AnimatedNumber value={stats.totalBooks} /></div>
          </motion.div>
          <motion.div className="card" style={styles.statCard} variants={cardVariants}>
            <div style={styles.statTitle}>Currently Borrowed</div>
            <div style={{ ...styles.statValue, color: 'var(--accent)' }}><AnimatedNumber value={stats.currentlyBorrowed} /></div>
          </motion.div>
          <motion.div className="card" style={styles.statCard} variants={cardVariants}>
            <div style={styles.statTitle}>Low Stock (&lt; 2)</div>
            <div style={{ ...styles.statValue, color: stats.lowStock > 0 ? 'var(--warning)' : 'inherit' }}>
              <AnimatedNumber value={stats.lowStock} />
            </div>
          </motion.div>
          <motion.div className="card" style={styles.statCard} variants={cardVariants}>
            <div style={styles.statTitle}>Overdue Items</div>
            <div style={{ ...styles.statValue, color: stats.overdue > 0 ? 'var(--danger)' : 'inherit' }}>
              <AnimatedNumber value={stats.overdue} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--space-lg)'
  },
  statCard: {
    textAlign: 'center',
    padding: 'var(--space-xl) var(--space-md)'
  },
  statTitle: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 600,
    marginBottom: 'var(--space-sm)'
  },
  statValue: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.5rem',
    fontWeight: 600,
    color: 'var(--text-main)'
  }
};

export default LibrarianDashboard;
