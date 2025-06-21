import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axiosInstance from "../api/axios"; // Adjust path as needed

// Fix Leaflet marker icons issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setFormData((prev) => ({
          ...prev,
          name: user.username || "",
          email: user.email || "",
        }));
        setIsUserLoggedIn(true);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/contact-form/contact", formData);
      if (response.status === 200) {
        setStatus({ type: "success", message: "Message sent successfully!" });
        setFormData((prev) => ({
          name: isUserLoggedIn ? prev.name : "",
          email: isUserLoggedIn ? prev.email : "",
          subject: "",
          message: "",
        }));
      } else {
        setStatus({ type: "error", message: "Failed to send message." });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.error || "Network error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Banner Section */}
      <section className="mb-30px">
        <div className="container">
          <div className="hero-banner hero-banner--sm">
            <div className="hero-banner__content">
              <h1>Contact Us</h1>
              <nav aria-label="breadcrumb" className="banner-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Contact Us
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-margin--small section-margin">
        <div className="container">
          {/* Map Section */}
          <div className="mb-5 pb-4">
            <MapContainer
              center={[19.076, 72.8777]}
              zoom={13}
              style={{ height: "420px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={[19.076, 72.8777]}>
                <Popup>Our office is located here in Mumbai!</Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="row">
            {/* Contact Info */}
            <div className="col-md-4 col-lg-3 mb-4 mb-md-0">
              <div className="media contact-info">
                <span className="contact-info__icon">
                  <i className="ti-home"></i>
                </span>
                <div className="media-body">
                  <h3>Mumbai, India</h3>
                  <p>Marine Drive</p>
                </div>
              </div>
              <div className="media contact-info">
                <span className="contact-info__icon">
                  <i className="ti-headphone"></i>
                </span>
                <div className="media-body">
                  <h3>
                    <a href="tel:+911234567890">+91 12345 67890</a>
                  </h3>
                  <p>Mon to Fri 9am to 6pm</p>
                </div>
              </div>
              <div className="media contact-info">
                <span className="contact-info__icon">
                  <i className="ti-email"></i>
                </span>
                <div className="media-body">
                  <h3>
                    <a href="mailto:support@mumbai.com">support@mumbai.com</a>
                  </h3>
                  <p>Send us your query anytime!</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-md-8 col-lg-9">
              <form
                onSubmit={handleSubmit}
                className="form-contact contact_form"
                id="contactForm"
                noValidate
              >
                <div className="row">
                  <div className="col-lg-5">
                    <input
                      className="form-control"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isUserLoggedIn || loading}
                    />
                    <input
                      className="form-control mt-3"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isUserLoggedIn || loading}
                    />
                    <input
                      className="form-control mt-3"
                      name="subject"
                      type="text"
                      placeholder="Enter Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="col-lg-7">
                    <textarea
                      className="form-control different-control w-100"
                      name="message"
                      cols="30"
                      rows="5"
                      placeholder="Enter Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    ></textarea>
                  </div>
                </div>

                {status && (
                  <div
                    className={`alert ${
                      status.type === "success" ? "alert-success" : "alert-danger"
                    } mt-3`}
                    role="alert"
                  >
                    {status.message}
                  </div>
                )}

                <div className="form-group text-center text-md-right mt-3">
                  <button
                    type="submit"
                    className="button button--active button-contactForm"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
