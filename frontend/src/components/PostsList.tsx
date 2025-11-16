import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

interface Post {
  _id: string;
  content: string;
  platforms: string[];
  scheduledAt: string;
  status: string;
}

const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (platformFilter) params.platform = platformFilter;

      const res = await api.get("/posts", { params });
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, statusFilter, platformFilter]);

  const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setPage(prev => prev + 1);

  const handleEdit = (postId: string, status: string) => {
    if (status === "published") {
      alert("Published posts cannot be edited");
      return;
    }
    navigate(`/posts/edit/${postId}`);
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}> Your Scheduled Posts</h2>

      {}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: "0.4rem 0.8rem" }}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>

        <select
          value={platformFilter}
          onChange={e => setPlatformFilter(e.target.value)}
          style={{ padding: "0.4rem 0.8rem" }}
        >
          <option value="">All Platforms</option>
          <option value="Twitter">Twitter</option>
          <option value="Facebook">Facebook</option>
          <option value="Instagram">Instagram</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <thead style={{ backgroundColor: "#f8fafc" }}>
              <tr>
                <th style={th}>Content</th>
                <th style={th}>Platforms</th>
                <th style={th}>Scheduled At</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}>{post.content}</td>
                  <td style={td}>{post.platforms.join(", ")}</td>
                  <td style={td}>{new Date(post.scheduledAt).toLocaleString()}</td>
                  <td style={td}>
                    <span
                      style={{
                        backgroundColor:
                          post.status === "published"
                            ? "#16a34a33"
                            : post.status === "scheduled"
                            ? "#2563eb33"
                            : "#facc1533",
                        color:
                          post.status === "published"
                            ? "#16a34a"
                            : post.status === "scheduled"
                            ? "#2563eb"
                            : "#ca8a04",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                      }}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td style={td}>
                    {post.status !== "published" && (
                      <button
                        onClick={() => handleEdit(post._id, post.status)}
                        style={{
                          background: "#2563eb",
                          color: "#fff",
                          border: "none",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                          marginRight: "0.5rem",
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(post._id)}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {}
      <div
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
        }}
      >
        <button
          onClick={handlePrev}
          disabled={page === 1}
          style={btn}
        >
          Prev
        </button>
        <span style={{ margin: "0 1rem" }}>Page {page}</span>
        <button
          onClick={handleNext}
          disabled={posts.length < 10}
          style={btn}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const th: React.CSSProperties = {
  padding: "0.8rem",
  textAlign: "left",
  fontWeight: "bold",
  borderBottom: "2px solid #ddd",
};

const td: React.CSSProperties = {
  padding: "0.8rem",
  textAlign: "left",
  verticalAlign: "top",
};

const btn: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "0.4rem 0.8rem",
  borderRadius: "6px",
  cursor: "pointer",
};

export default PostsList;
