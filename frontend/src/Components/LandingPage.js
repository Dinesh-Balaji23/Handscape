import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/LandingPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSearch,
  faMapMarkerAlt,
  faPhone,
  faStore,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

import home1 from "./Images/Home1.jpg";
import home2 from "./Images/Home2.jpg";
import aboutImage from "./Images/AboutImage.jpg";
import gallery1 from "./Images/Gallery1.jpg";
import gallery2 from "./Images/Gallery2.jpg";
import gallery3 from "./Images/Gallery3.jpg";
import gallery4 from "./Images/Gallery4.jpg";
import gallery5 from "./Images/Gallery5.jpg";
import gallery6 from "./Images/Gallery6.jpg";
import services1 from "./Images/Services1.jpeg";
import services2 from "./Images/Services2.jpeg";
import services3 from "./Images/Services3.jpeg";

const LandingPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();
  const testimonials = [
    {
      text: "Handscape is amazing! The handmade products are so unique, and the quality is top-notch.",
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const navbarLinks = document.querySelectorAll("a.nav-link");
    const handleClick = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) smoothScrollTo(targetSection, 1000);
    };
    navbarLinks.forEach((anchor) => anchor.addEventListener("click", handleClick));
    return () => {
      navbarLinks.forEach((anchor) => anchor.removeEventListener("click", handleClick));
    };
  }, []);

  const smoothScrollTo = (target, duration) => {
    const startPosition = window.pageYOffset;
    const targetPosition = target.offsetTop - 70;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  };

  const handleNavigation = (role) => {
    if (role === "user") window.location.href = "/login";
    else if (role === "seller") window.location.href = "/loginseller";
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            Handscape
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#heroCarousel">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#gallery">
                  Gallery
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#testimonials">
                  Testimonials
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="navbar-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon={faUser} /> Login/Signup
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleNavigation("user")}
                    >
                      <FontAwesomeIcon icon={faUser} /> User
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleNavigation("seller")}
                    >
                      <FontAwesomeIcon icon={faStore} /> Seller
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div
        id="heroCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="4000"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={home1} className="d-block w-100" alt="Handcrafted Item" />
            <div className="carousel-caption">
              <h1>
                Outstanding <span>Handmade Creations</span>
              </h1>
              <p>Discover unique and beautiful handcrafted goods from artisans.</p>
              <a href="#" className="btn btn-dark">
                See More
              </a>
            </div>
          </div>
          <div className="carousel-item">
            <img src={home2} className="d-block w-100" alt="Artisan Work" />
            <div className="carousel-caption">
              <h1>
                Authentic & <span>Handcrafted</span>
              </h1>
              <p>Support skilled artisans and explore their work.</p>
              <a href="#" className="btn btn-dark">
                Browse Collection
              </a>
            </div>
          </div>
        </div>
      </div>

      <section id="about" className="about-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-content">
              <h2 className="about-title">ABOUT US</h2>
              <p>Celebrating the art of handmade craftsmanship.</p>
              <p>
                At Handscape, we bring together skilled artisans and craft lovers,
                curating a collection of unique, handcrafted treasures. From
                exquisite decor to personalized gifts, each piece reflects the
                passion and creativity of its maker.
              </p>
              <p>
                Our mission is to support artisans, promote sustainable
                craftsmanship, and provide you with high-quality handmade products
                that add charm to your life.
              </p>
              <a href="#" className="btn btn-dark">
                See More
              </a>
            </div>
            <div className="col-md-6 image-container">
              <img src={aboutImage} alt="About Us" className="about-image" />
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <div className="container">
          <h2 className="gallery-title">OUR GALLERY</h2>
          <p className="gallery-description">
            Discover the beauty of handcrafted art. Each piece is a unique
            expression of creativity and skill, crafted with passion.
          </p>
          <div className="gallery-grid">
            {[gallery1, gallery2, gallery3, gallery4, gallery5, gallery6].map(
              (img, idx) => (
                <div className="gallery-item" key={idx}>
                  <img src={img} alt={`Gallery ${idx + 1}`} />
                  <div className="overlay">
                    <FontAwesomeIcon icon={faSearch} />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section id="services" className="services">
        <div className="services-container">
          <h2 className="services-title">Why Choose Handscape?</h2>
          <p className="services-subtitle">
            The ultimate marketplace for unique handcrafted goods.
          </p>
          <div className="services-list">
            {[
              {
                img: services1,
                title: "Wide Selection",
                desc: "Thousands of unique handcrafted items from talented artisans.",
              },
              {
                img: services2,
                title: "Secure Payments",
                desc: "Buy with confidence using our secure checkout process.",
              },
              {
                img: services3,
                title: "Faster Orders",
                desc: "Faster delivery with economical delivery charges.",
              },
            ].map((service, idx) => (
              <div className="service-box" key={idx}>
                <div className="service-img">
                  <img src={service.img} alt={service.title} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <h2 className="testimonials-title">What Our Customers Say</h2>
        <p className="testimonials-subtitle">Real experiences from our happy buyers.</p>
        <div className="testimonial-container">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-box ${index === activeTestimonial ? "active" : ""}`}
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
              className={`dot ${index === activeTestimonial ? "active" : ""}`}
              onClick={() => setActiveTestimonial(index)}
            ></span>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>About</h3>
            <p>
              Handscape is a marketplace for unique, handmade products crafted
              with passion by artisans worldwide.
            </p>
          </div>
          <div className="footer-column">
            <h3>Menu</h3>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Shop</a>
              </li>
              <li>
                <a href="#">Categories</a>
              </li>
              <li>
                <a href="#">Our Story</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Useful Links</h3>
            <ul>
              <li>
                <a href="#">Seller Registration</a>
              </li>
              <li>
                <a href="#">FAQs</a>
              </li>
              <li>
                <a href="#">Return Policy</a>
              </li>
              <li>
                <a href="#">Customer Support</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Erode, India
              </li>
              <li>
                <FontAwesomeIcon icon={faPhone} /> +91 9696969696
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} /> support@Handscape.com
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;