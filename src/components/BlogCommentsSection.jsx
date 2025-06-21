import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import CommentFormModal from "./CommentFormModal";
import CommentsArea from "./CommentsArea";

const BlogCommentsSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [replyToId, setReplyToId] = useState(null);
  const [replyingToName, setReplyingToName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const loadComments = async () => {
    try {
      const res = await axiosInstance.get(`/api/comments/${blogId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  useEffect(() => {
    if (blogId) loadComments();
  }, [blogId]);

  const handleReplyClick = (id, name) => {
    setReplyToId(id);
    setReplyingToName(name);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setReplyToId(null);
    setReplyingToName("");
    setShowModal(false);
  };

  return (
    <div className="container">
      <CommentsArea comments={comments} onReplyClick={handleReplyClick} />

      {/* 👇 Add a row and column wrapper for proper Bootstrap alignment */}
      <div className="d-flex justify-content-end my-3">
        <button
          className="btn btn-sm"
          style={{
            backgroundColor: "#e9ecef",
            border: "1px solid #ced4da",
            color: "#495057",
            padding: "6px 12px",
            fontSize: "14px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
          onClick={() => {
            setReplyToId(null);
            setReplyingToName("");
            setShowModal(true);
          }}
        >
          Leave a Comment
        </button>
      </div>

      <CommentFormModal
        show={showModal}
        onClose={handleModalClose}
        blogId={blogId}
        parentId={replyToId}
        replyingTo={replyingToName}
        onCommentAdded={loadComments}
      />
    </div>

  );
};

export default BlogCommentsSection;
