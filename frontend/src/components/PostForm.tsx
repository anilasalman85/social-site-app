import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

interface PostFormData {
  content: string;
  platforms: string[];
  scheduledAt: string;
  status: string;
}

const PostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [formData, setFormData] = useState<PostFormData>({
    content: "",
    platforms: [],
    scheduledAt: "",
    status: "scheduled",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await api.get(`/posts/${id}`);
          setFormData({
            content: res.data.content,
            platforms: res.data.platforms,
            scheduledAt: res.data.scheduledAt.slice(0, 16),
            status: res.data.status,
          });
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => {
      const alreadySelected = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: alreadySelected
          ? prev.platforms.filter(p => p !== platform)
          : [...prev.platforms, platform],
      };
    });
  };

  const validate = () => {
    if (!formData.content.trim()) return "Content is required.";
    if (formData.platforms.length === 0) return "Select at least one platform.";
    if (!formData.scheduledAt) return "Please select a scheduled date/time.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (id) {
        await api.put(`/posts/${id}`, formData);
        alert("Post updated successfully!");
        navigate("/posts");
      } else {
        await api.post("/posts", formData);
        alert("Post created successfully!");
        setFormData({ content: "", platforms: [], scheduledAt: "", status: "scheduled" });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error saving post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "3rem auto",
        background: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#1e3a8a",
        }}
      >
        {id ? " Edit Post" : " Create New Post"}
      </h2>

      {error && (
        <p
          style={{
            color: "#dc2626",
            background: "#fee2e2",
            padding: "0.6rem",
            borderRadius: "6px",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Content */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={5}
            placeholder="Write your post content..."
            style={inputStyle}
          />
        </div>

        {/* Platforms */}
        <div style={{ marginBottom: "1.2rem" }}>
          <label style={labelStyle}>Platforms:</label>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            {["Twitter", "Facebook", "Instagram"].map(p => (
              <label key={p} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <input
                  type="checkbox"
                  checked={formData.platforms.includes(p)}
                  onChange={() => handlePlatformChange(p)}
                />
                {p}
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div style={{ marginBottom: "1.2rem" }}>
          <label style={labelStyle}>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ ...inputStyle, height: "2.5rem" }}
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Schedule */}
        <div style={{ marginBottom: "1.2rem" }}>
          <label style={labelStyle}>Schedule Date & Time:</label>
          <input
            type="datetime-local"
            name="scheduledAt"
            value={formData.scheduledAt}
            onChange={handleChange}
            style={{ ...inputStyle, height: "2.5rem" }}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            backgroundColor: loading ? "#93c5fd" : "#2563eb",
            color: "white",
            padding: "0.8rem",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.3s ease",
          }}
          onMouseOver={e => {
            if (!loading) (e.currentTarget.style.backgroundColor = "#1e40af");
          }}
          onMouseOut={e => {
            if (!loading) (e.currentTarget.style.backgroundColor = "#2563eb");
          }}
        >
          {loading ? "Saving..." : id ? "Update Post" : "Create Post"}
        </button>
      </form>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  marginBottom: "0.4rem",
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.8rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "1rem",
  outline: "none",
  resize: "vertical",
};

export default PostForm;
