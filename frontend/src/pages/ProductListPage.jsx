import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { productsAPI } from '../api/api';
import { notify } from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatPrice } from '../utils/currency';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, product: null });
  
  const { logout, user } = useAuth();
  const pageSize = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter })
      };
      
      const response = await productsAPI.getAll(params);
      setProducts(response.content || []);
      setTotalPages(response.totalPages || 0);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.content?.map(p => p.category) || [])];
      setCategories(uniqueCategories);
    } catch (error) {
      notify.error('Failed to fetch products: ' + error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, categoryFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
    setPage(0); // Reset to first page when filtering
  };

  const handleDeleteClick = (product) => {
    setDeleteDialog({ isOpen: true, product });
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log('Attempting to delete product with ID:', deleteDialog.product.id);
      await productsAPI.delete(deleteDialog.product.id);
      console.log('Product deleted successfully');
      notify.success('Product deleted successfully');
      setDeleteDialog({ isOpen: false, product: null });
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      notify.error('Failed to delete product: ' + error.message);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, product: null });
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="header-content">
          <h1>Product Catalog</h1>
          <div className="user-info">
            Welcome, {user?.username}
            <button onClick={logout} className="btn btn-secondary btn-sm ml-2">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="filters-section">
          <div className="search-filters">
            <div className="form-group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <select
                value={categoryFilter}
                onChange={handleCategoryFilter}
                className="form-control"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <Link to="/products/new" className="btn btn-primary">
            Add New Product
          </Link>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-data">
            No products found. <Link to="/products/new">Add the first product</Link>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price (₹)</th>
                    <th>Stock</th>
                    <th>Supplier</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-name">
                          {product.productName}
                          {product.description && (
                            <div className="product-description">{product.description}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td className="price">{formatPrice(product.price)}</td>
                      <td>
                        <span className={`stock ${product.stockQuantity <= 10 ? 'low-stock' : ''}`}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td>{product.supplier || '-'}</td>
                      <td className="actions">
                        <Link 
                          to={`/products/${product.id}/edit`}
                          className="btn btn-secondary btn-sm mr-2"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteDialog.product?.productName}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default ProductListPage;
