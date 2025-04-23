import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/AddProduct.css';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    description: '',
    price: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image file
      if (!file.type.match('image.*')) {
        setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'File size should be less than 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      setErrors(prev => ({ ...prev, image: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    let temp = {};
    if (!formData.productName.trim()) temp.productName = "Product name is required";
    if (!formData.category.trim()) temp.category = "Category is required";
    if (!formData.description.trim()) temp.description = "Description is required";
    if (!formData.price) temp.price = "Price is required";
    else if (isNaN(formData.price) || formData.price <= 0) temp.price = "Price must be a positive number";
    if (!formData.image) temp.image = "Image is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    setIsSubmitting(true);
    setSuccessMessage('');
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('sellerName', localStorage.getItem('sellerName'));
      formDataToSend.append('sellerId', localStorage.getItem('sellerId'));
      formDataToSend.append('image', formData.image);
  
      const response = await fetch('http://localhost:9000/addproduct', {
        method: 'POST',
        body: formDataToSend
      });
  
      // First check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'Server returned non-JSON response');
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }
  
      setSuccessMessage('Product added successfully! Redirecting...');
      
      setTimeout(() => {
        resetForm();
        navigate('/seller-dashboard');
      }, 1500);
  
    } catch (err) {
      // Handle different error types
      if (err.message.includes('<!DOCTYPE html>')) {
        console.error('Server returned HTML error page');
        alert('Server error occurred. Please check console for details.');
      } else {
        alert(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      productName: '',
      category: '',
      description: '',
      price: '',
      image: null
    });
    setPreviewImage(null);
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Add New Book</h2>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className={errors.productName ? 'error-input' : ''}
            />
            {errors.productName && <span className="error">{errors.productName}</span>}
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error-input' : ''}
            />
            {errors.category && <span className="error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error-input' : ''}
              rows="4"
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error-input' : ''}
              min="0"
              step="0.01"
            />
            {errors.price && <span className="error">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label>Product Cover Image</label>
            <div className="image-upload-container">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-label">
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="image-preview" />
                    <button 
                      type="button" 
                      className="change-image-btn"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Change Image
                    </button>
                  </>
                ) : (
                  <div className="upload-placeholder">
                    <span>+</span>
                    <p>Click to upload image</p>
                    <p className="file-requirements">(JPEG/PNG, max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
            {errors.image && <span className="error">{errors.image}</span>}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Adding Product...
              </>
            ) : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;