import React from "react";

const BlogCard = ({ blog }) => {
  const blogLink = `/blog/${blog._id}`;

  return (
    <div className="single-recent-blog-post">
      <div className="thumb">
        <img className="img-fluid" src={blog.image} alt={blog.titleLine1} />
        <ul className="thumb-info">
          <li>
            <a href="#">
              <i className="ti-user"></i> {blog.author || "Admin"}
            </a>
          </li>
          <li>
            <a href="#">
              <i className="ti-notepad"></i> {new Date(blog.date).toDateString()}
            </a>
          </li>
          <li>
            <a href="#">
              <i className="ti-themify-favicon"></i> {blog.commentsCount || 0} Comments
            </a>
          </li>
        </ul>
      </div>

      <div className="details mt-20">
        <a href={blogLink}>
          <h3 style={{ marginBottom: "5px" }}>{blog.titleLine1}</h3>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "normal",
              marginTop: "0",
              marginBottom: "10px"
            }}
          >
            {blog.titleLine2}
          </p>
        </a>

        {/* ✅ Styled Tag Badges */}
        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  marginRight: "6px",
                  marginBottom: "5px",
                  textTransform: "capitalize"
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {Array.isArray(blog.contentParagraphs) && blog.contentParagraphs.length > 0 && (
          <p>{blog.contentParagraphs[0]}</p>
        )}

        <a className="button" href={blogLink}>
          Read More <i className="ti-arrow-right"></i>
        </a>
      </div>
    </div>
  );
};

export default BlogCard;
