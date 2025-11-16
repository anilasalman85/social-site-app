import PostsList from "../components/PostsList";

const Posts = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>All Posts</h2>
      <p style={{ color: "#555", marginBottom: "1rem" }}>
        Filter, view, and manage your posts below.
      </p>
      <PostsList />
    </div>
  );
};

export default Posts;
