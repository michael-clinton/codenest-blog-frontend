import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import BlogCard from "./BlogCard";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [categoryPage, setCategoryPage] = useState(1);
  const categoriesPerPage = 4; // ✅ Updated to 2 per your request

  const blogsPerPage = 4;

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/api/blog/categories-all");
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      }
    })();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setBlogs([]);
      setTotalPages(0);
      return;
    }

    setLoading(true);
    axiosInstance
      .get(
        `/api/blog/category/${selectedCategory.slug}?page=${currentPage}&limit=${blogsPerPage}`
      )
      .then((res) => {
        setBlogs(res.data.blogs || []);
        setTotalPages(Math.ceil((res.data.totalCount || 0) / blogsPerPage));
      })
      .catch((err) => {
        console.error("Failed to fetch blogs:", err);
        setBlogs([]);
        setTotalPages(0);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCategoryPageChange = (dir) => {
    const totalCategoryPages = Math.ceil(categories.length / categoriesPerPage);
    if (dir === "next" && categoryPage < totalCategoryPages) {
      setCategoryPage(categoryPage + 1);
    } else if (dir === "prev" && categoryPage > 1) {
      setCategoryPage(categoryPage - 1);
    }
  };

  const displayedCategories = categories.slice(
    (categoryPage - 1) * categoriesPerPage,
    categoryPage * categoriesPerPage
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column-reverse" : "row",
        justifyContent: "space-between",
        padding: "20px 40px",
        gap: "20px",
      }}
    >
      {/* Blog Content Section */}
      <div style={{ flex: 2, marginLeft: isMobile ? "0px" : "70px" }}>
        {loading ? (
          <p>Loading blogs...</p>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        ) : (
          <p>Please select a category to view posts.</p>
        )}

        {totalPages > 1 && (
          <div style={{ marginTop: "30px" }}>
            <nav className="blog-pagination justify-content-center d-flex">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                    ‹
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                    ›
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Category Selector Section */}
      <div
        style={{
          width: isMobile ? "100%" : "250px",
          borderLeft: !isMobile ? "1px solid #eee" : "none",
          paddingLeft: isMobile ? "0" : "20px",
          marginRight: isMobile ? "0px" : "70px",
        }}
      >
        <h5 style={{ marginBottom: "20px", textAlign: isMobile ? "center" : "left" }}>
          Categories
        </h5>

        {displayedCategories.map((cat) => {
          const isSelected = selectedCategory?.slug === cat.slug;
          return (
            <div
              key={cat._id}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px",
                marginBottom: "12px",
                border: isSelected ? "2px solid #0056b3" : "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: isSelected ? "#007bff" : "#f9f9f9",
                color: isSelected ? "#fff" : "#333",
                cursor: "pointer",
                boxShadow: isSelected
                  ? "0 4px 12px rgba(0, 123, 255, 0.3)"
                  : "0 2px 6px rgba(0,0,0,0.05)",
                transform: isSelected ? "scale(1.02)" : "scale(1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = isSelected ? "scale(1.02)" : "scale(1)")
              }
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: "40px",
                  height: "40px",
                  marginRight: "16px",
                  objectFit: "contain",
                }}
              />
              <span style={{ fontWeight: 500 }}>{cat.name}</span>
            </div>
          );
        })}

        {/* Category Pagination Controls */}
        {categories.length > categoriesPerPage && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <button
              onClick={() => handleCategoryPageChange("prev")}
              disabled={categoryPage === 1}
              style={{
                marginRight: "10px",
                padding: "6px 12px",
                cursor: categoryPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              ‹
            </button>
            <button
              onClick={() => handleCategoryPageChange("next")}
              disabled={categoryPage >= Math.ceil(categories.length / categoriesPerPage)}
              style={{
                padding: "6px 12px",
                cursor:
                  categoryPage >= Math.ceil(categories.length / categoriesPerPage)
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
