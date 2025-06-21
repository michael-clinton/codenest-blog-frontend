import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../api/axios";

const CommentFormModal = ({
    show,
    onClose,
    blogId,
    parentId,
    replyingTo,
    onCommentAdded,
}) => {
    const [form, setForm] = useState({ subject: "", message: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        profileImage: "",
    });

    // Reset form on modal open/close
    useEffect(() => {
        if (!show) {
            setForm({ subject: "", message: "" });
            setError("");
            setSuccess("");
        }
    }, [show]);

    // Load user data from localStorage and fetch profile
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!storedUser.id) return;

        axiosInstance
            .get(`/api/profile/basic/${storedUser.id}`)
            .then((res) => {
                const { firstName, email, profileImage } = res.data;
                setUserData({
                    name: firstName || storedUser.username || "",
                    email: email || storedUser.email || "",
                    profileImage: profileImage || "",
                });
            })
            .catch((err) => {
                console.error("❌ Error fetching user profile:", err);
                setUserData({
                    name: storedUser.username || "",
                    email: storedUser.email || "",
                    profileImage: storedUser.profileImage || "",
                });
            });
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userData.name || !userData.email || !form.message.trim()) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            const payload = {
                blogId,
                parentId,
                ...form,
                name: userData.name,
                email: userData.email,
                image: userData.profileImage,
            };

            const res = await axiosInstance.post("/api/comments/add", payload);
            console.log("✅ Comment added:", res.data);

            setForm({ subject: "", message: "" });
            setSuccess("Comment posted!");
            onCommentAdded();
            onClose();
        } catch (err) {
            console.error("❌ Submit failed:", err);
            setError("Server error. Please try again.");
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {replyingTo ? `Replying to ${replyingTo}` : "Leave a Comment"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        id="subject"
                        className="form-control mb-2"
                        placeholder="Subject (optional)"
                        value={form.subject}
                        onChange={handleChange}
                    />
                    <textarea
                        id="message"
                        className="form-control mb-3"
                        rows="4"
                        placeholder="Message *"
                        value={form.message}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit" className="w-100 mb-2" variant="primary">
                        Post Comment
                    </Button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CommentFormModal;
