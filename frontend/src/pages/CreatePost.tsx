import PostForm from "../components/PostForm";

const CreatePost = () => {
  return (
    <div style={{ padding: "2rem", background: "#f9fafb", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#1e3a8a", marginBottom: "1rem" }}>
       My Scheduler
      </h1>
      <p style={{ textAlign: "center", color: "#4b5563", marginBottom: "2rem" }}>
        Fill in the details below to schedule your post across multiple platforms.
      </p>
      <PostForm />
    </div>
  );
};

export default CreatePost;
