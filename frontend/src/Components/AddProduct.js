import React, { useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './CSS/AddProduct.css';

const AddProduct = () => {
  const { sellername } = useParams();
  console.log("Seller name from URL:", sellername);
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
      if (!file.type.match('image.*')) {
        setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'File size should be less than 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      setErrors(prev => ({ ...prev, image: '' }));
      
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
    if (!sellername) {
      alert("Seller name is missing in the URL");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
        const formDataToSend = new FormData();
        formDataToSend.append('productName', formData.productName);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('image', formData.image);

        // Include seller name in the URL
        const response = await fetch(`http://localhost:9000/addproduct/${sellername}`, {
            method: 'POST',
            body: formDataToSend
        });

      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }
  
      setSuccessMessage('Product added successfully! Redirecting...');
      
      setTimeout(() => {
        resetForm();
        navigate(`/seller-dashboard/${sellername}`);
      }, 1500);
  
    } catch (err) {
      alert(err.message);
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
    <>
     <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'black' }}>
        <div className="container-fluid">
          <a className="navbar-brand" href={`/seller-dashboard/${sellername}`} style={{ color: 'orange', fontWeight: 'bold' }}>
            Handscape (Seller)
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link to={`/seller-dashboard/${sellername}`} className="nav-link active">Home</Link></li>
            <li className="nav-item"><Link to={`/addproduct/${sellername}`} className="nav-link">Add Product</Link></li>
            <li className="nav-item"><Link to={`/seller-orders/${sellername}`} className="nav-link">Orders</Link></li>
            <li className="nav-item"><Link to="/login" className="nav-link">Logout ({sellername})</Link></li>
          </ul>
        </div>
      </nav>

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
    </>
  );
};

export default AddProduct;