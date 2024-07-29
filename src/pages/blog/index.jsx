import { useEffect, useState } from "react";
import { getBlogPosts } from "../../config/hygraph";
import BlogCard from "../../components/blogCard";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const data = await getBlogPosts();
      setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#434343]">
      <h1 className="text-4xl font-bold text-white mb-8">Blog Page</h1>
      <div className="w-4/5">
        {posts.map((post, index) => (
          <BlogCard
            key={index}
            title={post.title}
            slug={post.slug}
            datePublish={post.datePublish}
            content={post.content.text}
            photo={post.photo ? post.photo.url : ""}
            author={post.author.name}
          />
        ))}
      </div>
    </div>
  );
}
