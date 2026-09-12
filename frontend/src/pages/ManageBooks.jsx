import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Spinner, ErrorMessage } from '../components/ui/Feedback';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', author: '', isbn: '', category: '', quantity: 1, availableQuantity: 1 });
  const [formError, setFormError] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await client.get(`/books?page=${page}&size=10`);
      setBooks(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const handleEdit = (book) => {
    setFormData(book);
    setShowForm(true);
    window.scrollTo(0,0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await client.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (formData.id) {
        await client.put(`/books/${formData.id}`, formData);
      } else {
        await client.post('/books', formData);
      }
      setShowForm(false);
      setFormData({ id: null, title: '', author: '', isbn: '', category: '', quantity: 1, availableQuantity: 1 });
      fetchBooks();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to save book');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <h2>Manage Books</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setFormData({ id: null, title: '', author: '', isbn: '', category: '', quantity: 1, availableQuantity: 1 }); }}>
          {showForm ? 'Cancel' : 'Add New Book'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 className="serif">{formData.id ? 'Edit Book' : 'Add Book'}</h3>
          {formError && <ErrorMessage message={formError} />}
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <input type="text" className="form-control" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ flex: '1 1 45%' }}/>
            <input type="text" className="form-control" placeholder="Author" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required style={{ flex: '1 1 45%' }}/>
            <input type="text" className="form-control" placeholder="ISBN" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} required style={{ flex: '1 1 45%' }}/>
            <input type="text" className="form-control" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required style={{ flex: '1 1 45%' }}/>
            <label style={{ flex: '1 1 45%' }}>Total Quantity
              <input type="number" min="1" className="form-control" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
            </label>
            <div style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
              <button type="submit" className="btn btn-primary">Save Book</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <Spinner /> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--surface-alt)' }}>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Author</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={styles.td}><strong>{book.title}</strong><br/><small>{book.isbn}</small></td>
                  <td style={styles.td}>{book.author}</td>
                  <td style={styles.td}>{book.category}</td>
                  <td style={styles.td}>{book.availableQuantity} / {book.quantity}</td>
                  <td style={styles.td}>
                    <button className="btn btn-outline" style={styles.actionBtn} onClick={() => handleEdit(book)}>Edit</button>
                    <button className="btn btn-outline" style={{...styles.actionBtn, color: 'var(--danger)', borderColor: 'var(--danger-light)'}} onClick={() => handleDelete(book.id)}>Delete</button>
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
  td: { padding: 'var(--space-md)' },
  actionBtn: { padding: '4px 8px', fontSize: '0.8rem', marginRight: '4px' }
};

export default ManageBooks;
