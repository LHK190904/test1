import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GraphQLClient, gql } from "graphql-request";

const endpoint =
  "https://api-ap-northeast-1.hygraph.com/v2/clxvbpuit01y507w7f2gmn4qn/master";
const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MTkzNzU0NjMsImF1ZCI6WyJodHRwczovL2FwaS1hcC1ub3J0aGVhc3QtMS5oeWdyYXBoLmNvbS92Mi9jbHh2YnB1aXQwMXk1MDd3N2YyZ21uNHFuL21hc3RlciIsIm1hbmFnZW1lbnQtbmV4dC5ncmFwaGNtcy5jb20iXSwiaXNzIjoiaHR0cHM6Ly9tYW5hZ2VtZW50LWFwLW5vcnRoZWFzdC0xLmh5Z3JhcGguY29tLyIsInN1YiI6IjQ4MTE2YWQ4LTgwMjQtNDNmZi1hNjkwLWUxZjg0M2MxZDVhNiIsImp0aSI6ImNrYTVqMmVvYjAzdGMwMXdoMGRmZDY3cnkifQ.xqDg8HnYTZPd9weAVpYQYnjIkOSNEqbZiZv3SlTP_dW4IPx4OptH1APkmlAo83AUCuH6m6gXgk8Q_uMYLVDKJlaxuxYTWZsqJ_tePo7NhVM6k5aXeLGP84I76X_846kjtC8Q1_zngCmPeZcI3DpMmL5rNJJF2eu35Wq7LGNzI45JD9dT2-2yB3lu8KdbTO06aMboTiyeZvGk1h4zZ4lVy8JShgGVE2xkGNbxyrd8li2842gBwbdfI-EmNiSZZ7CHQFavK9pDL3PuHd6ZPTy2sXIlIuF6tAmDjSDxSJg2_bsW4cRYg5iJc6Adu5Nu7lJ_y3uz2TvGAooiG9Mqz7ge4_crTJ-3QxOjBWypPgFkmh0S2ASXKs2lbF2_iWC8L3NMZgeQdbN6X-5IpGxEJvZUobtbZUwnK9VEsjg6DpEBoiMc3QthK6lSv7a2cEYcFwrwory82y0g9ZfH_Zqx_u2ldyS63_Fr09tlqQX9d__9q2qJwG1KWtxgLKopCnw7Xd5oIv2Qusxw7nw1JjkjJH7k94rtNaCB3Hr2pjlC7NRXC_RzSlDTxshaigG69jSpYf4YhgpKYzUKgWhjtvvGK6iojsCgGOAupgNT0KaR4RNpz3xyQFkTMWb7KaatjdXARFvSvreF-U3knvmaLeV9V4RIAz4JmiLotUc0bGjvJjYwPbA";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${token}`,
  },
});

const QUERY = gql`
  query Posts($slug: String!) {
    posts(where: { slug: $slug }) {
      title
      slug
      datePublish
      content {
        text
      }
      photo {
        url
      }
      author {
        name
      }
    }
  }
`;

function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { posts } = await graphQLClient.request(QUERY, { slug });
      setPost(posts[0]);
    };

    fetchPost();
  }, [slug]);

  const formatContent = (text) => {
    return text.split("\n").map((str, index) => (
      <div key={index}>
        {str}
        <br />
      </div>
    ));
  };

  if (!post) return <div className="max-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#434343]">
      <div className="bg-gray-100 rounded-lg shadow-md p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{post.title}</h1>
        <img
          src={post.photo.url}
          alt={post.title}
          className="mb-8 rounded-lg w-full h-64 object-cover"
        />
        <div className="text-gray-800 leading-relaxed mb-4">
          {formatContent(post.content.text)}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Tác giả: {post.author.name}</p>
            <p className="text-sm text-gray-600">
              Ngày đăng bài: {post.datePublish}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
