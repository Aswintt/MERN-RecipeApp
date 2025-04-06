import { useEffect, useState, useRef } from "react";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const lastPostRef = useRef();

  // Fetch posts
  const fetchPosts = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/admin/posts?page=${page}`
      );

      // If no data, stop further fetches
      if (data.length === 0) return;

      setPosts((prevPosts) => [
        ...prevPosts,
        ...data.filter(
          (newPost) => !prevPosts.some((post) => post._id === newPost._id)
        ),
      ]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (lastPostRef.current) observer.observe(lastPostRef.current);

    return () => {
      if (lastPostRef.current) observer.unobserve(lastPostRef.current);
    };
  }, []);

  // Load posts when page changes
  useEffect(() => {
    fetchPosts();
  }, [page, fetchPosts]);

  // Handle delete post
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_SERVER_URL}/admin/posts/${postId}`
        );
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } catch (error) {
        console.error("Error deleting post", error);
      }
    }
  };

  return (
    <div className="admin-posts">
      <h2>Posts</h2>
      <ul className="posts-list">
        {posts.map((post, index) => (
          <li
            key={post._id}
            className="post-card"
            ref={index === posts.length - 1 ? lastPostRef : null}
          >
            <h3>{post.name}</h3>
            <div className="post-actions">
              <button
                onClick={() => handleDelete(post._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {loading && <p>Loading more...</p>}
      {posts.length === 0 && !loading && <p>No posts found.</p>}
    </div>
  );
};

export default Posts;
