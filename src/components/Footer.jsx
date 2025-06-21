import React from "react";
import NewsletterWidget from "./NewsletterWidget"; // import the dynamic newsletter component

const Footer = () => {
  return (
    <footer className="footer-area section-padding">
      <div className="container">
        <div className="row">
          {/* About Us */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="single-footer-widget">
              <h6>About Us</h6>
              <p>
                We are a developer-focused blog committed to sharing practical coding tutorials, best practices, and modern software development insights. Whether you're a beginner or an experienced developer, you'll find clear explanations, real-world examples, and useful tools to support your learning journey.
              </p>
            </div>
          </div>


          {/* Newsletter */}
          <div className="col-lg-4 col-md-6 col-sm-6">
            <NewsletterWidget />
          </div>

          {/* Instagram Feed */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="single-footer-widget mail-chimp">
              <h6 className="mb-20">Instagram Feed</h6>
              <ul className="instafeed d-flex flex-wrap">
                {["i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8"].map((img, index) => (
                  <li key={index}>
                    <img src={`/${img}.jpg`} alt={`Instagram ${index + 1}`} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="col-lg-2 col-md-6 col-sm-6">
            <div className="single-footer-widget">
              <h6>Follow Us</h6>
              <p>Let us be social</p>
              <div className="footer-social d-flex align-items-center">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-dribbble"></i></a>
                <a href="#"><i className="fab fa-behance"></i></a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom d-flex justify-content-center align-items-center flex-wrap">
          <p className="footer-text m-0">
            © {new Date().getFullYear()} All rights reserved | Crafted with{" "}
            <i className="fa fa-code" aria-hidden="true"></i> and curiosity at{" "}
            <a href="https://devscribe.com" target="_blank" rel="noopener noreferrer">
              CodeNest
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
