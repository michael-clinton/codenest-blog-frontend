import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // Optional if not already globally included

const Header = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = storedUser.id;

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out from your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Swal.fire('Logged out!', 'You have been successfully logged out.', 'success');
        navigate('/login');
      }
    });
  };

  return (
    <header className="header_area">
      <div className="main_menu">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container box_1620">
            <a className="navbar-brand logo_h" href="/">
              <svg
                width="250"
                height="80"
                viewBox="0 0 250 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="20" y="25" width="50" height="30" fill="#1976d2" rx="5" />
                <rect x="25" y="30" width="40" height="20" fill="#115293" rx="3" />
                <rect x="40" y="50" width="20" height="5" fill="#0d3c61" rx="2" />
                <rect x="22" y="57" width="54" height="3" fill="#0b2c4a" rx="1.5" />
                <text
                  x="32"
                  y="45"
                  fontFamily="monospace"
                  fontSize="18"
                  fontWeight="bold"
                  fill="#fff"
                >
                  {"</>"}
                </text>
                <text
                  x="85"
                  y="50"
                  fontFamily="'Poppins', sans-serif"
                  fontSize="21"
                  fontWeight="bold"
                  fill="#333"
                >
                  CodeNest
                </text>
              </svg>
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>

            <div className="collapse navbar-collapse offset" id="navbarSupportedContent">
              <ul className="nav navbar-nav menu_nav justify-content-center">
                <li className="nav-item">
                  <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/archive" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Archive
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/category" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Category
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contact" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Contact
                  </NavLink>
                </li>

                {userId ? (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to={`/profile/${userId}`}
                        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <a
                        onClick={handleLogout}
                        className="nav-link text-danger"
                        style={{ cursor: 'pointer', textDecoration: 'none' }}
                      >
                        Logout
                      </a>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <NavLink
                      to="/login"
                      className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                    >
                      Login
                    </NavLink>
                  </li>
                )}
              </ul>

              <ul className="nav navbar-nav navbar-right navbar-social">
                <li><a href="#"><i className="ti-facebook"></i></a></li>
                <li><a href="#"><i className="ti-twitter-alt"></i></a></li>
                <li><a href="#"><i className="ti-instagram"></i></a></li>
                <li><a href="#"><i className="ti-skype"></i></a></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
