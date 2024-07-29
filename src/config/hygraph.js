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

export async function getBlogPosts() {
  const query = gql`
    query {
      posts {
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
  const data = await graphQLClient.request(query);
  return data.posts;
}
