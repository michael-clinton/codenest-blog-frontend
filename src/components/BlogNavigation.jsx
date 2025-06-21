import React from "react";
import { Link } from "react-router-dom";

const BlogNavigation = ({ previousPost, nextPost }) => {
  return (
    <div className="navigation-area">
      <div className="row">

        {/* Previous Post */}
        <div className="col-lg-6 col-md-6 col-12 nav-left d-flex align-items-center">
          <Link
            to={previousPost.link || "#"}
            className="d-flex align-items-center w-100 p-2 rounded"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              className="img-fluid rounded"
              src={previousPost.image || "https://via.placeholder.com/50"}
              alt="Previous Post"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                marginRight: "12px",
              }}
            />
            <div>
              <p className="mb-1 text-muted" style={{ fontSize: "0.75rem" }}>
                ← Prev Post
              </p>
              <h6 style={{ fontSize: "0.9rem", margin: 0 }}>
                {previousPost.titleLine1 || "Previous Post"}
              </h6>
            </div>
          </Link>
        </div>

        {/* Next Post */}
        <div className="col-lg-6 col-md-6 col-12 nav-right d-flex justify-content-end align-items-center">
          <Link
            to={nextPost.link || "#"}
            className="d-flex align-items-center justify-content-end w-100 p-2 rounded"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="text-end" style={{ marginRight: "12px" }}>
              <p className="mb-1 text-muted" style={{ fontSize: "0.75rem" }}>
                Next Post →
              </p>
              <h6 style={{ fontSize: "0.9rem", margin: 0 }}>
                {nextPost.titleLine1 || "Next Post"}
              </h6>
            </div>
            <img
              className="img-fluid rounded"
              src={nextPost.image || "https://via.placeholder.com/50"}
              alt="Next Post"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
              }}
            />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BlogNavigation;
