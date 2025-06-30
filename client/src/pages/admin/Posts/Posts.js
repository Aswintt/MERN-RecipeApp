import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Posts.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeReportId, setActiveReportId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/admin/posts`
        );
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/admin/posts/${postId}`
      );
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  const handleClearReports = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all reports?"
    );
    if (!confirmed) return;

    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/admin/posts/${postId}/clear-reports`
      );
      // refetch updated posts
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/admin/posts`
      );
      setPosts(data);
      setActiveReportId(null);
    } catch (err) {
      console.error("Failed to clear reports:", err);
    }
  };

  return (
    <div className="admin-posts-wrapper">
      <h2 className="admin-posts-title">Posts</h2>
      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No posts found.</p>}
      <div className="admin-posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="admin-post-card">
            <h3>{post.name}</h3>
            <div className="admin-post-actions">
              <button
                onClick={() => handleDelete(post._id)}
                className="admin-post-delete-btn"
              >
                Delete
              </button>
              <Link to={`/recipe/${post.slug}`}>
                <button className="admin-post-view-btn">View</button>
              </Link>
              <div className="admin-post-report-icon-wrapper">
                <button
                  className="admin-post-report-btn"
                  onClick={() =>
                    setActiveReportId(
                      activeReportId === post._id ? null : post._id
                    )
                  }
                >
                  ⚠️
                  {post.reports && post.reports.length > 0 && (
                    <span className="admin-post-report-count">
                      {post.reports.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {activeReportId === post._id && (
              <div className="admin-report-popup">
                <div className="admin-report-popup-header">
                  <span>Reports</span>
                  <div className="admin-popup-icons">
                    <button
                      onClick={() => handleClearReports(post._id)}
                      className="admin-clear-reports-btn"
                      title="Clear Reports"
                    >
                      🗑️
                    </button>
                    <button
                      onClick={() => setActiveReportId(null)}
                      className="admin-close-popup"
                      title="Close"
                    >
                      ❌
                    </button>
                  </div>
                </div>

                <div className="admin-report-popup-body">
                  {post.reports?.length > 0 ? (
                    post.reports.map((report, idx) => (
                      <p key={idx} className="admin-report-item">
                        {report.message}
                      </p>
                    ))
                  ) : (
                    <p>No reports</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
