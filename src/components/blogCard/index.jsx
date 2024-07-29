import { Link } from "react-router-dom";

function BlogCard({ title, slug, datePublish, content, photo, author }) {
  return (
    <div className="bg-white p-4 mb-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/posts/${slug}`}>
        <div className="flex items-start">
          <img
            src={photo}
            alt={title}
            className="mb-4 w-1/4 h-48 object-cover rounded-lg mr-4"
          />
          <div className="flex flex-col justify-between flex-1">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">{title}</h2>
              <p className="text-gray-800 mb-2 line-clamp-4">{content}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BlogCard;
