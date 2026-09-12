import React, { useState, useEffect, useContext } from 'react';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { Spinner, ErrorMessage, EmptyState } from '../components/ui/Feedback';
import { motion } from 'framer-motion';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { role } = useContext(AuthContext);
  const [borrowingId, setBorrowingId] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page,
        size: 12,
        ...(search && { search }),
        ...(category && { category }),
        ...(availableOnly && { availableOnly: true }),
      });
      const res = await client.get('/books?' + params.toString());
      setBooks(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, category, availableOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchBooks();
  };

  const handleBorrow = async (bookId) => {
    setBorrowingId(bookId);
    try {
      await client.post('/borrow/' + bookId);
      alert('Book borrowed successfully!');
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to borrow book');
    } finally {
      setBorrowingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <h2>Library Catalog</h2>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by title or author..." 
            style={{ flex: '1', marginBottom: 0 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select 
            className="form-control" 
            style={{ width: 'auto', marginBottom: 0 }}
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(0); }}
          >
            <option value="">All Categories</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Technology">Technology</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <input 
              type="checkbox" 
              checked={availableOnly}
              onChange={e => { setAvailableOnly(e.target.checked); setPage(0); }}
            />
            Available Only
          </label>
          <motion.button whileTap={{ scale: 0.95 }} type="submit" className="btn btn-primary">Search</motion.button>
        </form>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchBooks} />}

      {loading ? (
        <Spinner />
      ) : books.length === 0 ? (
        <EmptyState title="No Books Found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <motion.div 
            style={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {books.map(book => (
              <motion.div 
                key={book.id} 
                className="card" 
                style={styles.bookCard}
                variants={cardVariants}
                whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
              >
                <div style={styles.coverPlaceholder}>{book.title.charAt(0)}</div>
                <div style={styles.bookInfo}>
                  <span style={styles.categoryBadge}>{book.category}</span>
                  <h4 style={{ margin: 'var(--space-xs) 0' }}>{book.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>by {book.author}</p>
                  
                  <div style={{ marginTop: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 600, 
                      color: book.availableQuantity > 0 ? 'var(--accent)' : 'var(--danger)' 
                    }}>
                      {book.availableQuantity > 0 ? book.availableQuantity + ' Available' : 'Checked Out'}
                    </span>
                    
                    {role === 'STUDENT' && book.availableQuantity > 0 && (
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-outline" 
                        style={{ padding: '4px 12px', fontSize: '0.85rem' }}
                        onClick={() => handleBorrow(book.id)}
                        disabled={borrowingId === book.id}
                      >
                        {borrowingId === book.id ? '...' : 'Borrow'}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)' }}>
              <motion.button whileTap={{ scale: 0.95 }}
                className="btn btn-outline" 
                disabled={page === 0} 
                onClick={() => setPage(p => p - 1)}
              >Previous</motion.button>
              <span style={{ display: 'flex', alignItems: 'center' }}>Page {page + 1} of {totalPages}</span>
              <motion.button whileTap={{ scale: 0.95 }}
                className="btn btn-outline" 
                disabled={page >= totalPages - 1} 
                onClick={() => setPage(p => p + 1)}
              >Next</motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 'var(--space-lg)',
  },
  bookCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    overflow: 'hidden',
  },
  coverPlaceholder: {
    backgroundColor: 'var(--surface-alt)',
    height: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
    fontFamily: 'var(--font-serif)',
    color: 'var(--text-light)',
    borderBottom: '1px solid var(--border)'
  },
  bookInfo: {
    padding: 'var(--space-md)',
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    backgroundColor: 'var(--accent-light)',
    color: 'var(--accent)',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
};

export default Books;

