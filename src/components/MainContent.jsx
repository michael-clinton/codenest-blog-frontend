import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import BlogCard from "./BlogCard";
import CategoryWidget from "./CategoryWidget";
import NewsletterWidget from "./NewsletterWidget";
import TagCloudWidget from "./TagCloudWidget";
import BlogSlider from "./BlogSlider";
import PopularPostWidget from "./PopularPostWidget";

const MainContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const selectedTag = searchParams.get("tag") || "";
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(pageParam);
  const [blogs, setBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchPaginatedBlogs = async () => {
      try {
        let url = `/api/blogs?page=${pageParam}&limit=4`;

        if (selectedCategory) {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        if (selectedTag) {
          url += `&tag=${encodeURIComponent(selectedTag)}`;
        }

        const response = await axiosInstance.get(url);
        const { blogs, totalPages } = response.data;
        setBlogs(blogs);
        setTotalPages(totalPages);
        setCurrentPage(pageParam);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchPaginatedBlogs();
  }, [pageParam, selectedCategory, selectedTag]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setSearchParams((prev) => {
        const updated = new URLSearchParams(prev);
        updated.set("page", page);
        return updated;
      });
    }
  };

  // ✅ Toggle category filter
  const handleCategorySelect = (category) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      const current = updated.get("category");

      if (current === category) {
        updated.delete("category"); // unselect if same
      } else {
        updated.set("category", category); // select new
      }

      updated.set("page", 1);
      return updated;
    });
  };

  // ✅ Toggle tag filter
  const handleTagSelect = (tag) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      const current = updated.get("tag");

      if (current === tag) {
        updated.delete("tag"); // unselect if same
      } else {
        updated.set("tag", tag); // select new
      }

      updated.set("page", 1);
      return updated;
    });
  };

  return (
    <main className="site-main">
      {!(selectedCategory || selectedTag) && (
        <>
          <section className="mb-30px">
            <div className="container">
              <div className="hero-banner">
                <div className="hero-banner__content">
                  <h3>Code & Learn</h3>
                  <h1>Master Modern Web Development</h1>
                  <h4>June 11, 2025</h4>
                </div>
              </div>
            </div>
          </section>

          <BlogSlider />
        </>
      )}
      
      <section className="blog-post-area section-margin mt-4">
        <div className="container">
          <div className="row">
            {/* Blog Posts Section */}
            <div className="col-lg-8">
              {blogs.length > 0 ? (
                blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
              ) : (
                <p>No blogs found.</p>
              )}

              {/* Pagination */}
              <div className="pagination-wrapper">
                <nav className="blog-pagination justify-content-center d-flex">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                        <i className="ti-angle-left"></i>
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                        <i className="ti-angle-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <hr style={{ marginTop: "5px" }} />

            {/* Sidebar Section */}
            <div className="col-lg-4 sidebar-widgets">
              <div className="widget-wrap">
                <NewsletterWidget />
                <CategoryWidget
                  onCategorySelect={handleCategorySelect}
                  selectedCategory={selectedCategory}
                />
                <PopularPostWidget />
                <TagCloudWidget
                  onTagSelect={handleTagSelect}
                  selectedTag={selectedTag}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
