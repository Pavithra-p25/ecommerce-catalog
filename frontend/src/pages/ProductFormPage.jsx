import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productsAPI } from '../api/api';
import { notify } from '../components/Notification';
import FormInput from '../components/FormInput';
import './ProductFormPage.css';

const ProductFormPage = () => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    description: '',
    price: '',
    stockQuantity: '',
    supplier: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id, isEdit]);

  const fetchProduct = async () => {
    setInitialLoading(true);
    try {
      const product = await productsAPI.getById(id);
      setFormData({
        productName: product.productName || '',
        category: product.category || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stockQuantity: product.stockQuantity?.toString() || '',
        supplier: product.supplier || ''
      });
    } catch (error) {
      notify.error('Failed to fetch product: ' + error.message);
      navigate('/products');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    } else if (formData.productName.length < 2) {
      newErrors.productName = 'Product name must be at least 2 characters';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }
    
    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = 'Stock quantity is required';
    } else {
      const stock = parseInt(formData.stockQuantity);
      if (isNaN(stock) || stock < 0) {
        newErrors.stockQuantity = 'Stock quantity must be a non-negative integer';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity)
      };

      if (isEdit) {
        await productsAPI.update(id, productData);
        notify.success('Product updated successfully');
      } else {
        await productsAPI.create(productData);
        notify.success('Product created successfully');
      }
      
      navigate('/products');
    } catch (error) {
      notify.error(`Failed to ${isEdit ? 'update' : 'create'} product: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <Link to="/products" className="btn btn-secondary">
          Back to Products
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-col">
              <FormInput
                label="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                error={errors.productName}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="form-col">
              <FormInput
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                placeholder="Enter category"
                required
              />
            </div>
          </div>

          <FormInput
            label="Description"
            name="description"
            type="textarea"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Enter product description (optional)"
          />

          <div className="form-row">
            <div className="form-col">
              <FormInput
                label="Price (₹)"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="Enter price in rupees"
                required
              />
            </div>
            <div className="form-col">
              <FormInput
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={handleChange}
                error={errors.stockQuantity}
                placeholder="0"
                required
              />
            </div>
          </div>

          <FormInput
            label="Supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            error={errors.supplier}
            placeholder="Enter supplier name (optional)"
          />

          <div className="form-actions">
            <Link to="/products" className="btn btn-secondary mr-2">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading 
                ? (isEdit ? 'Updating...' : 'Creating...') 
                : (isEdit ? 'Update Product' : 'Create Product')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormPage;
