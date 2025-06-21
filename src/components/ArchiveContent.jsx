import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

// Widgets
import CategoryWidget from "./CategoryWidget";
import TagCloudWidget from "./TagCloudWidget";
import NewsletterWidget from "./NewsletterWidget";
import PopularPostWidget from "./PopularPostWidget";

// Styles
import "../assets/css/archiveContent.css";

const ArchiveContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const selectedCategory_ = searchParams.get("category") || "";
  const selectedTag = searchParams.get("tag") || "";

  const postsPerPage = 4;

  useEffect(() => {
    const fetchBlogsAndCategories = async () => {
      try {
        const [blogRes, categoryRes] = await Promise.all([
          axiosInstance.get("/api/blogs-all"),
          axiosInstance.get("/api/blog/categories"),
        ]);

        setBlogs(blogRes.data.blogs || []);
        setCategories(["All", ...(categoryRes.data.categories || [])]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogsAndCategories();
  }, []);

  const filteredPosts = blogs.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.titleLine1
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const currentPosts = filteredPosts.slice(
    indexOfLastPost - postsPerPage,
    indexOfLastPost
  );

  const handleTagSelect = (tag) => {
    navigate(`/?tag=${encodeURIComponent(tag)}`);
  };

  const handleCategorySelect = (category) => {
    navigate(`/?category=${encodeURIComponent(category)}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    // <section className="blog-post-area section-margin">
     <div className="container" style={{ marginTop: "10px" }}>
        {/* Search */}
        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search blog by title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Category Buttons */}
        <div className="row mb-4">
          <div className="col d-flex flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm me-2 mb-2 ${selectedCategory === cat ? "btn-primary" : "btn-outline-primary"
                  }`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="row">
          {/* Blog List */}
          <div className="col-lg-8">
            <div className="row">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p>Loading...</p>
                </div>
              ) : currentPosts.length === 0 ? (
                <p>No posts found.</p>
              ) : (
                currentPosts.map((post) => (
                  <div className="col-md-6 mb-4" key={post._id}>
                    <div className="single-recent-blog-post card-view">
                      <div className="thumb">
                        <img
                          className="card-img rounded-0"
                          src={post.image}
                          alt={post.titleLine1}
                        />
                      </div>
                      <div className="details mt-20">
                        <a href={`/blog/${post._id}`}>
                          <h3>{post.titleLine1}</h3>
                        </a>
                        <p className="blog-preview-text">
                          {post.contentParagraphs?.[0]?.substring(0, 100)}...
                        </p>
                        <a
                          className="button-read d-block mt-2"
                          href={`/blog/${post._id}`}
                        >
                          Read More <i className="ti-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="row">
                <div className="col-lg-12">
                  <nav className="blog-pagination justify-content-center d-flex">
                    <ul className="pagination">
                      {Array.from({ length: totalPages }, (_, num) => (
                        <li
                          key={num}
                          className={`page-item ${currentPage === num + 1 ? "active" : ""
                            }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(num + 1)}
                          >
                            {num + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4 sidebar-widgets">
            <div className="widget-wrap">
              <NewsletterWidget />
              <CategoryWidget
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory_}
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
    // </section>
  );
};

export default ArchiveContent;
