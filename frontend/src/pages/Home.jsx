import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const Home = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ textAlign: 'center', marginTop: 'var(--space-xxl)', padding: 'var(--space-xl)' }}
    >
      <motion.h1 variants={itemVariants} className="serif" style={{ fontSize: '3rem', color: 'var(--accent)' }}>
        Welcome to Folio
      </motion.h1>
      <motion.p variants={itemVariants} style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginTop: 'var(--space-md)', maxWidth: '600px', margin: 'var(--space-md) auto var(--space-xl)' }}>
        Discover your next favorite book today. Browse our extensive catalog or log in to manage your active loans.
      </motion.p>
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/books" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>Browse Catalog</Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/login" className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>Student Login</Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
