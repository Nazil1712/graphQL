import { useQuery, gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";

const QUERY_ALL_USERS = gql`
  query {
    users {
      id
      name
      age
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query {
    movies {
      name
      yearOfPublication
    }
  }
`;

const QUERY_MOVIE_BY_NAME = gql`
  query GetMovieByName($moviename: String!) {
    movie(name: $moviename) {
      name
      yearOfPublication
    }
  }
`;

const DisplayData = () => {
  const { data, loading, error } = useQuery(QUERY_ALL_USERS);
  const [movieName, setMovieName] = useState("");
  const [fetchMovie, { data: singleMovieData, error: singleMovieError }] =
    useLazyQuery(QUERY_MOVIE_BY_NAME);

  const {
    data: allMovies,
    loading: allMovieLoading,
    error: allMovieError,
  } = useQuery(QUERY_ALL_MOVIES);

  return (
    <div>
      <div className="grid grid-cols-3">
        <div>
          <h1 className="text-3xl">List Of Users</h1>
          {data &&
            data.users.map((v, i, arr) => (
              <div className="mt-2 border-2 p-2" key={v.id}>
                <h1>Name : {v.name}</h1>
                <p>Age : {v.age}</p>
                <p>Nationality : {v.nationality}</p>
              </div>
            ))}
        </div>
        <div>
          <h1 className="text-3xl">List Of Movies</h1>
          {allMovies &&
            allMovies.movies.map((v, i, arr) => (
              <div className="mt-2 border-2 p-2" key={v.id}>
                <h1>Name : {v.name}</h1>
                <p>Year : {v.yearOfPublication}</p>
                <p>IsInTheaters : {v.isInTheaters}</p>
              </div>
            ))}
        </div>
        <div>
          <h1 className="text-3xl ml-2">Search Movie By Name</h1>
          <div className="mt-2 ml-2">
            <div>
              <label>Movie Name : </label>
              <input
                type="text"
                placeholder="Enter Movie Name here"
                className="outline-none border-2 border-cyan-800"
                onChange={(e) => {
                  setMovieName(e.target.value);
                }}
              />
              <button
                className="ml-2 border border-black bg-gray-600 text-white rounded-md"
                onClick={(e) => {
                  console.log(movieName);
                  fetchMovie({
                    variables: {
                      moviename: movieName,
                    },
                  });
                }}
              >
                Search Movie
              </button>
            </div>
            <div>
              {singleMovieData? (singleMovieData.movie.name===movieName && (
                <div className="mt-2 border-2 p-2">
                  <h1>Name : {singleMovieData.movie.name}</h1>
                  <p>YearOfPublication : {singleMovieData.movie.yearOfPublication}</p>
                </div>
              )):null}

              {singleMovieError && <h1 className="text-red-600 text-3xl text-center">There was an error fetching the data</h1>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayData;
