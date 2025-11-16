import { useEffect, useState } from "react";
import api from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface StatsData {
  totalPosts: number;
  scheduledCount: number;
  publishedCount: number;
  postsByPlatform: { _id: string; count: number }[];
}

interface UpcomingPost {
  _id: string;
  content: string;
  platforms: string[];
  scheduledAt: string;
  status: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get("/dashboard/stats");
      const upcomingRes = await api.get("/dashboard/upcoming");

      setStats(statsRes.data);

      setUpcoming(
        Array.isArray(upcomingRes.data?.upcomingPosts)
          ? upcomingRes.data.upcomingPosts
          : []
      );
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading dashboard...</p>;

  const postsByPlatform = stats?.postsByPlatform ?? [];

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1.5rem" }}> Dashboard</h2>

      
      {stats && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1.5rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          <div style={statCard}>
            <h4>Total Posts</h4>
            <p>{stats.totalPosts}</p>
          </div>
          <div style={statCard}>
            <h4>Scheduled</h4>
            <p>{stats.scheduledCount}</p>
          </div>
          <div style={statCard}>
            <h4>Published</h4>
            <p>{stats.publishedCount}</p>
          </div>
        </div>
      )}

      {/* Posts by Platform Chart */}
      {postsByPlatform.length > 0 && (
        <div style={{ marginTop: "2rem", width: "100%", height: 300 }}>
          <h3>Posts by Platform</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={postsByPlatform}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {}
      <div style={{ marginTop: "3rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Upcoming Scheduled Posts</h3>

        {upcoming.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No upcoming posts.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {upcoming.map((post) => (
              <div
                key={post._id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "1rem",
                  background: "#f9fafb",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  transition: "0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
                    {post.content.length > 120
                      ? post.content.slice(0, 120) + "..."
                      : post.content}
                  </p>

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
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.status}
                  </span>
                </div>

                <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                  Platforms:{" "}
                  <strong style={{ color: "#111827" }}>
                    {post.platforms.join(", ")}
                  </strong>
                </p>

                <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                  Scheduled For:{" "}
                  <strong style={{ color: "#111827" }}>
                    {new Date(post.scheduledAt).toLocaleString()}
                  </strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const statCard: React.CSSProperties = {
  flex: "1",
  background: "#f3f4f6",
  borderRadius: "10px",
  padding: "1rem",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

export default Dashboard;
