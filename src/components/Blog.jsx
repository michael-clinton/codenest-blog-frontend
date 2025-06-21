import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import BlogDetailsHead from "../components/BlogDetailsHead";
import BlogNavigation from "../components/BlogNavigation";
import BlogCommentsSection from "./BlogCommentsSection";
import NewsletterWidget from "./NewsletterWidget";
import TagCloudWidget from "./TagCloudWidget";
import PopularPostWidget from "./PopularPostWidget";
import CategoryWidget from "./CategoryWidget"; // Optional if you want to add category sidebar

const BlogDetail = () => {
  const { id: blogId } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previousPost, setPreviousPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);

  const [hasFetched, setHasFetched] = useState(false); // ✅ Add this

  useEffect(() => {
    if (hasFetched) return; // ✅ Prevent duplicate calls

    const fetchBlogAndNavigation = async () => {
      try {
        const blogRes = await axiosInstance.get(`/api/blog/${blogId}`);
        setBlog(blogRes.data);

        const navRes = await axiosInstance.get("/api/blog/random-two");
        const previousPost = navRes.data.previousPost || {};
        const nextPost = navRes.data.nextPost || {};

        if (previousPost._id) previousPost.link = `/blog/${previousPost._id}`;
        if (nextPost._id) nextPost.link = `/blog/${nextPost._id}`;

        setPreviousPost(previousPost);
        setNextPost(nextPost);

        setHasFetched(true); // ✅ Mark as fetched
      } catch (err) {
        console.error("Error fetching blog or navigation posts:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAndNavigation();
  }, [blogId, hasFetched]);

  const handleTagSelect = (tag) => {
    navigate(`/?tag=${encodeURIComponent(tag)}`);
  };

  const handleCategorySelect = (category) => {
    navigate(`/?category=${encodeURIComponent(category)}`);
  };

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found</p>;

  return (
    <div>
      <section className="blog-post-area section-margin">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <BlogDetailsHead
                blogId={blogId}
                image={blog.image}
                titleLine1={blog.titleLine1}
                titleLine2={blog.titleLine2}
                categories={blog.categories}
                tags={blog.tags}
                author={blog.author}
                dateTime={blog.date}
                userImage={blog.authorImage}
                contentParagraphs={blog.contentParagraphs}
                quotes={blog.quotes}
                socialLinks={blog.socialLinks}
              />

              {previousPost && nextPost && (
                <BlogNavigation previousPost={previousPost} nextPost={nextPost} />
              )}

              <BlogCommentsSection blogId={blogId} />
            </div>

            <div className="col-lg-4 sidebar-widgets">
              <div className="widget-wrap">
                <NewsletterWidget />
                <TagCloudWidget onTagSelect={handleTagSelect} />
                <CategoryWidget onCategorySelect={handleCategorySelect} />
                <PopularPostWidget />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
