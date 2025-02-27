import React, { useState, useEffect } from 'react';
import './CSS/HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch, faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

// Import all images
import Home1 from './Images/Home1.jpg';
import Home2 from './Images/Home2.jpg'; // Ensure this matches the file name
import AboutImage from './Images/AboutImage.jpg'; // Ensure this matches the file name
import Gallery1 from './Images/Gallery1.jpg';
import Gallery2 from './Images/Gallery2.jpg';
import Gallery3 from './Images/Gallery3.jpg';
import Gallery4 from './Images/Gallery4.jpg';
import Gallery5 from './Images/Gallery5.jpg';
import Gallery6 from './Images/Gallery6.jpg';
import Services1 from './Images/Services1.jpeg';
import Services2 from './Images/Services2.jpeg';
import Services3 from './Images/Services3.jpeg';

const Craftique = () => {
  // State for Testimonials
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // State for Carousel
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Testimonials Data
  const testimonials = [
    {
      text: "Craftique is amazing! The handmade products are so unique, and the quality is top-notch.",
      author: "Sarah W.",
    },
    {
      text: "The best marketplace for handcrafted goods! Fast delivery and secure payment options.",
      author: "James L.",
    },
    {
      text: "I love the variety here. I found the perfect handmade gift, and the seller was great!",
      author: "Emily R.",
    },
  ];

  // Carousel Data
  const carouselItems = [
    {
      image: Home1, // Use imported image
      title: "Outstanding Handmade Creations",
      description: "Discover unique and beautiful handcrafted goods from artisans.",
      buttonText: "See More",
    },
    {
      image: Home2, // Use imported image
      title: "Authentic & Handcrafted",
      description: "Support skilled artisans and explore their work.",
      buttonText: "Browse Collection",
    },
  ];

  // Testimonial Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Carousel Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">Craftique</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link active" href="#">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#">About Us</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Gallery</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Services</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Testimonials</a></li>
              <li className="nav-item">
                <a className="nav-link" href="#"><FontAwesomeIcon icon={faUser} /> Login/Signup</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section (Carousel) */}
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`carousel-item ${index === carouselIndex ? "active" : ""}`}
            >
              <img src={item.image} className="d-block w-100" alt={`Slide ${index + 1}`} />
              <div className="carousel-caption">
                <h1>{item.title}</h1>
                <p>{item.description}</p>
                <a href="#" className="btn btn-dark">{item.buttonText}</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-content">
              <h2 className="about-title">ABOUT US</h2>
              <p>Celebrating the art of handmade craftsmanship.</p>
              <p>
                At Craftique, we bring together skilled artisans and craft lovers, curating a collection of unique, handcrafted treasures.
                From exquisite decor to personalized gifts, each piece reflects the passion and creativity of its maker.
              </p>
              <p>
                Our mission is to support artisans, promote sustainable craftsmanship, and provide you with high-quality handmade products that add charm to your life.
              </p>
              <a href="#" className="btn btn-dark">See More</a>
            </div>
            <div className="col-md-6 image-container">
              <img src={AboutImage} alt="About Us" className="about-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery-section">
        <div className="container">
          <h2 className="gallery-title">OUR GALLERY</h2>
          <p className="gallery-description">
            Discover the beauty of handcrafted art. Each piece is a unique expression of creativity and skill, crafted with passion.
          </p>
          <div className="gallery-grid">
            {[Gallery1, Gallery2, Gallery3, Gallery4, Gallery5, Gallery6].map((image, index) => (
              <div className="gallery-item" key={index}>
                <img src={image} alt={`Gallery Item ${index + 1}`} />
                <div className="overlay">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="services-container">
          <h2 className="services-title">Why Choose Craftique?</h2>
          <p className="services-subtitle">The ultimate marketplace for unique handcrafted goods.</p>
          <div className="services-list">
            {[Services1, Services2, Services3].map((image, index) => (
              <div className="service-box" key={index}>
                <div className="service-img">
                  <img src={image} alt={`Service ${index + 1}`} />
                </div>
                <h3>{index === 0 ? "Wide Selection" : index === 1 ? "Secure Payments" : "Faster Orders"}</h3>
                <p>
                  {index === 0
                    ? "Thousands of unique handcrafted items from talented artisans."
                    : index === 1
                    ? "Buy with confidence using our secure checkout process."
                    : "Faster delivery with economical delivery charges."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2 className="testimonials-title">What Our Customers Say</h2>
        <p className="testimonials-subtitle">Real experiences from our happy buyers.</p>
        <div className="testimonial-container">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-box ${index === testimonialIndex ? "active" : ""}`}
            >
              <div className="testimonial-content">
                <p className="testimonial-text">{testimonial.text}</p>
                <h3 className="testimonial-author">— {testimonial.author}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === testimonialIndex ? "active" : ""}`}
              onClick={() => setTestimonialIndex(index)}
            ></span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>About</h3>
            <p>Craftique is a marketplace for unique, handmade products crafted with passion by artisans worldwide.</p>
          </div>
          <div className="footer-column">
            <h3>Menu</h3>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Shop</a></li>
              <li><a href="#">Categories</a></li>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Useful Links</h3>
            <ul>
              <li><a href="#">Seller Registration</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Return Policy</a></li>
              <li><a href="#">Customer Support</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li><FontAwesomeIcon icon={faMapMarkerAlt} /> Erode, India</li>
              <li><FontAwesomeIcon icon={faPhone} /> +91 9696969696</li>
              <li><FontAwesomeIcon icon={faEnvelope} /> support@craftique.com</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Craftique;