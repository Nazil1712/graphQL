import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faUserPlus,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { Bounce, toast } from "react-toastify";

const QUERY_ALL_USERS = gql`
  query {
    users {
      id
      name
      age
      nationality
      username
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query {
    movies {
      id
      name
      yearOfPublication
      isInTheaters
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

const CREATE_USER = gql`
  mutation CreateUser($userInfo: CreateUserInput!) {
    createUser(input: $userInfo) {
      name
      id
      age
    }
  }
`;

const UPDATE_USER = gql`
  mutation ($userInfo: UpdateUserInput!) {
    updateUser(update: $userInfo) {
      id
      name
      username
      age
      nationality
    }
  }
`;

const DELETE_USER = gql`
  mutation ($id: ID!) {
    deleteUser(id: $id) {
      name
      age
      nationality
    }
  }
`;

const CREATE_MOVIE = gql`
  mutation ($movieInfo: CreateMovieInput!) {
    createMovie(input: $movieInfo) {
      name
      isInTheaters
    }
  }
`;

const UPDATE_MOVIE = gql`
  mutation ($update: UpdateMovieInput!) {
    updateMovie(update: $update) {
      name
    }
  }
`;

const DELETE_MOVIE = gql`
  mutation ($id: ID!) {
    deleteMovie(id: $id) {
      name
      isInTheaters
    }
  }
`;

const DisplayData = () => {
  const [movieName, setMovieName] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [createUserPopup, setCreateUserPopup] = useState(false);
  const [updateUserPopup, setupdateUserPopup] = useState(false);
  const [createMoviePopup, setCreateMoviePopup] = useState(false);
  const [updateMoviePopup, setUpdateMoviePopup] = useState(false);
  const [updateUser, setUpdateUser] = useState();
  const [updateMovie, setUpdateMovie] = useState();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    nationality: "",
    username: "",
  });

  const [MovieData, setMovieData] = useState({
    name: "",
    yearOfPublication: "",
    isInTheaters: "",
  });

  const { data, loading, error, refetch } = useQuery(QUERY_ALL_USERS);
  const {
    data: allMovies,
    loading: allMovieLoading,
    error: allMovieError,
    refetch: refetchAllMovies,
  } = useQuery(QUERY_ALL_MOVIES);

  const [fetchMovie, { data: singleMovieData, error: singleMovieError }] =
    useLazyQuery(QUERY_MOVIE_BY_NAME);

  const [createUser, { data: createdUser, error: createUserError }] =
    useMutation(CREATE_USER);

  const [createMovieFunction, { data: createdMovie }] =
    useMutation(CREATE_MOVIE);

  const [
    updateUserFunction,
    { data: updatedUserData, error: updateUserError },
  ] = useMutation(UPDATE_USER);

  const [updateMovieFunction] = useMutation(UPDATE_MOVIE);

  const [deleteUserFunction, { data: deletedUser, error: deleteUserError }] =
    useMutation(DELETE_USER);

  const [deleteMovieFunction] = useMutation(DELETE_MOVIE);

  const handleSearch = (name) => {
    setMovieName(name)
    console.log("Movie name from handleSearch", name);
    fetchMovie({
      variables: {
        moviename: name,
      },
    });
  };

  const handleTyping = (e) => {
    const name = e.target.value;
    if (name === "") return;
    setMovieName(name);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      handleSearch(name);
    }, 3000);

    setTypingTimeout(timeout);
  };

  const debounceFunction = (fn, delay) => {
    let timerId;
    return function () {
      let context = this, args = arguments;

      clearTimeout(timerId)
      timerId = setTimeout(()=>{
        fn.apply(context,args)
      },delay)

    };
  };
  

  const toggleCreateUserPopup = () => {
    setCreateUserPopup(!createUserPopup);
  };

  const toggleUpdateUserPopUp = () => {
    setupdateUserPopup(!updateUserPopup);
  };

  const toggleCreateMoviePopup = () => {
    setCreateMoviePopup(!createMoviePopup);
  };

  const toggleUpdateMoviePopup = () => {
    setUpdateMoviePopup(!updateMoviePopup);
  };

  const handleUpdate = (id) => {
    toggleUpdateUserPopUp();
    const user = data.users.find((v, i, arr) => v.id === id);
    setUpdateUser(user);
  };

  const handleDelete = (id) => {
    deleteUserFunction({
      variables: {
        id: id,
      },
    });
    notifyDelete("User");
    refetch();
  };

  const handleMovieDelete = (id) => {
    deleteMovieFunction({
      variables: {
        id: id,
      },
    });
    notifyDelete("Movie");
    refetchAllMovies();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMovieDataChange = (e) => {
    setMovieData({
      ...MovieData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser({
      ...updateUser,
      [name]: value,
    });
  };

  const handleUpdateMovieChange = (e) => {
    let { name, value } = e.target;
    if (name === "isInTheaters") {
      value = value === "true";
    }
    setUpdateMovie({
      ...updateMovie,
      [name]: value,
    });
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      age: "",
      nationality: "",
      username: "",
    });
  };
  const resetMovieData = () => {
    setMovieData({
      name: "",
      yearOfPublication: "",
      isInTheaters: "",
    });
  };

  const handleMovieUpdate = (id) => {
    toggleUpdateMoviePopup();
    console.log(id);
    const movie = allMovies.movies.find((v, i, arr) => v.id === id);
    console.log(movie);
    setUpdateMovie(movie);
  };

  const notifyCreate = (entity) => {
    toast.success(`${entity} created successfully`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };
  const notifyUpdate = (entity) => {
    toast.success(`${entity} updated successfully`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };
  const notifyDelete = (entity) => {
    toast.warn(`${entity} deleted successfully`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl inline-block">List Of Users </h1>{" "}
            <FontAwesomeIcon
              icon={faUserPlus}
              onClick={toggleCreateUserPopup}
              className="text-2xl ml-4 text-blue-500 cursor-pointer"
            />
          </div>
          {data &&
            data.users.map((v, i, arr) => (
              <div className="mt-2 border-2 p-2" key={v.id}>
                <h1>Name : {v.name}</h1>{" "}
                <span className="float-right flex flex-col gap-3">
                  <FontAwesomeIcon
                    icon={faPencil}
                    className="text-green-500 cursor-pointer"
                    onClick={() => handleUpdate(v.id)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(v.id)}
                  />
                </span>
                <p>Age : {v.age}</p>
                <p>Nationality : {v.nationality}</p>
              </div>
            ))}
        </div>
        <div>
          <div className="flex items-center gap-5">
            <h1 className="text-3xl">List Of Movies</h1>
            <span onClick={toggleCreateMoviePopup}>
              <FontAwesomeIcon
                icon={faVideo}
                className="text-2xl cursor-pointer text-blue-600"
              />
              <span className="relative bottom-3 text-2xl text-blue-600 font-bold">
                +
              </span>
            </span>
          </div>
          {allMovies &&
            allMovies.movies.map((v, i, arr) => (
              <div className="mt-2 border-2 p-2" key={v.id}>
                <h1>Name : {v.name}</h1>
                <span className="float-right flex flex-col gap-3">
                  <FontAwesomeIcon
                    icon={faPencil}
                    className="text-green-500 cursor-pointer"
                    onClick={() => handleMovieUpdate(v.id)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleMovieDelete(v.id)}
                  />
                </span>
                <p>Year : {v.yearOfPublication}</p>
                <p>IsInTheaters : {v.isInTheaters ? "YES" : "NO"}</p>
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
                className="outline-none border-2 border-gray-400 p-2 rounded-md"
                onKeyUp={debounceFunction((e)=>handleSearch(e.target.value),1000)}
                onKeyDown={(e) => { 
                  if (e.key === "Enter") {
                    handleSearch(movieName);
                  }
                }}
              />
              <button
                className="ml-2 border border-black bg-gray-600 text-white rounded-md p-2"
                onClick={handleSearch}
              >
                Search Movie
              </button>
            </div>
            <div>
              {singleMovieData
                ? singleMovieData.movie.name === movieName && (
                    <div className="mt-2 border-2 p-2">
                      <h1>Name : {singleMovieData.movie.name}</h1>
                      <p>
                        YearOfPublication :{" "}
                        {singleMovieData.movie.yearOfPublication}
                      </p>
                    </div>
                  )
                : null}

              {singleMovieError && movieName && (
                <h1 className="text-red-600 text-3xl text-center">
                  There was an error fetching the data
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>

      {createUserPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p
              onClick={toggleCreateUserPopup}
              className="float-right text-red-500 cursor-pointer"
            >
              X
            </p>
            <h2 className="text-lg font-semibold mb-4">Enter Details</h2>
            <div>
              <label className="block mb-2">
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <label className="block mb-2">
                Age:
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={(e) => handleInputChange(e)}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <label className="block mb-2">
                Nationality:
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange(e)}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <label className="block mb-2">
                Username:
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange(e)}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <div className="flex justify-end">
                <button
                  className="bg-cyan-500 text-white p-2 rounded-md"
                  onClick={() => {
                    // console.log(formData);
                    createUser({
                      variables: {
                        userInfo: {
                          name: formData.name,
                          age: Number(formData.age),
                          username: formData.username,
                          nationality: formData.nationality,
                        },
                      },
                    });
                    notifyCreate("User");
                    refetch();
                    toggleCreateUserPopup();
                    resetFormData();
                  }}
                >
                  Submit
                </button>
                <button
                  className="ml-2 bg-red-500 text-white p-2 rounded-md"
                  onClick={toggleCreateUserPopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {updateUserPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p
              onClick={toggleUpdateUserPopUp}
              className="float-right text-red-500 cursor-pointer"
            >
              X
            </p>
            <h2 className="text-lg font-semibold mb-4">Update User Details</h2>
            <div>
              <label className="block mb-2">
                Name:
                <input
                  type="text"
                  name="name"
                  value={updateUser.name}
                  onChange={handleUpdateChange}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <label className="block mb-2">
                Age:
                <input
                  type="number"
                  name="age"
                  value={updateUser.age}
                  onChange={(e) => handleUpdateChange(e)}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <label className="block mb-2">
                Nationality:
                <input
                  type="text"
                  name="nationality"
                  value={updateUser.nationality}
                  onChange={(e) => handleUpdateChange(e)}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <label className="block mb-2">
                Username:
                <input
                  type="text"
                  name="username"
                  value={updateUser.username}
                  onChange={(e) => handleUpdateChange(e)}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <div className="flex justify-end">
                <button
                  className="bg-cyan-500 text-white p-2 rounded-md"
                  onClick={() => {
                    // console.log(formData);
                    updateUserFunction({
                      variables: {
                        userInfo: {
                          id: updateUser.id,
                          name: updateUser.name,
                          username: updateUser.username,
                          age: Number(updateUser.age),
                          nationality: updateUser.nationality,
                        },
                      },
                    });
                    notifyUpdate("User");
                    refetch();
                    toggleUpdateUserPopUp();
                  }}
                >
                  Update
                </button>
                <button
                  className="ml-2 bg-red-500 text-white p-2 rounded-md"
                  onClick={toggleUpdateUserPopUp}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {createMoviePopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p
              onClick={toggleCreateMoviePopup}
              className="float-right text-red-500 cursor-pointer"
            >
              X
            </p>
            <h2 className="text-lg font-semibold mb-4">Enter Details</h2>
            <div>
              <label className="block mb-2">
                Name:
                <input
                  type="text"
                  name="name"
                  value={MovieData.name}
                  onChange={handleMovieDataChange}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <label className="block mb-2">
                Year Of Publication
                <input
                  type="number"
                  name="yearOfPublication"
                  value={MovieData.yearOfPublication}
                  onChange={(e) => handleMovieDataChange(e)}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <label className="block mb-2">
                Is This Movie in Theaters ?
                <input
                  type="text"
                  name="isInTheaters"
                  value={MovieData.isInTheaters}
                  onChange={(e) => handleMovieDataChange(e)}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <div className="flex justify-end">
                <button
                  className="bg-cyan-500 text-white p-2 rounded-md"
                  onClick={() => {
                    // console.log(formData);
                    createMovieFunction({
                      variables: {
                        movieInfo: {
                          name: MovieData.name,
                          yearOfPublication: Number(
                            MovieData.yearOfPublication
                          ),
                          isInTheaters:
                            MovieData.isInTheaters.toLowerCase() == "yes"
                              ? true
                              : false,
                        },
                      },
                    });
                    notifyCreate("Movie");
                    refetchAllMovies();
                    toggleCreateMoviePopup();
                    resetMovieData();
                  }}
                >
                  Submit
                </button>
                <button
                  className="ml-2 bg-red-500 text-white p-2 rounded-md"
                  onClick={toggleCreateMoviePopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {updateMoviePopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p
              onClick={toggleUpdateMoviePopup}
              className="float-right text-red-500 cursor-pointer"
            >
              X
            </p>
            <h2 className="text-lg font-semibold mb-4">Enter Details</h2>
            <div>
              <label className="block mb-2">
                Name:
                <input
                  type="text"
                  name="name"
                  value={updateMovie.name}
                  onChange={handleUpdateMovieChange}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <label className="block mb-2">
                Year Of Publication
                <input
                  type="number"
                  name="yearOfPublication"
                  value={updateMovie.yearOfPublication}
                  onChange={(e) => handleUpdateMovieChange(e)}
                  className="border border-gray-400 p-2 rounded-md w-full outline-none"
                />
              </label>
              <div className="">
                <div>Is This Movie in Theaters (YES/NO)?</div>
                <div>
                  <input
                    type="radio"
                    name="isInTheaters"
                    value={Boolean(true)}
                    checked={updateMovie.isInTheaters == true}
                    onChange={(e) => handleUpdateMovieChange(e)}
                  />
                  <lable>YES</lable>
                  <input
                    type="radio"
                    name="isInTheaters"
                    value={Boolean(false)}
                    checked={updateMovie.isInTheaters == false}
                    onChange={(e) => handleUpdateMovieChange(e)}
                    className="ml-5"
                  />
                  <lable>NO</lable>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-cyan-500 text-white p-2 rounded-md"
                  onClick={() => {
                    // console.log(formData);
                    console.log("UpdateMovie", updateMovie);
                    updateMovieFunction({
                      variables: {
                        update: {
                          id: updateMovie.id,
                          name: updateMovie.name,
                          isInTheaters: updateMovie.isInTheaters,
                          yearOfPublication: Number(
                            updateMovie.yearOfPublication
                          ),
                        },
                      },
                    });
                    notifyUpdate("Movie");
                    refetchAllMovies();
                    toggleUpdateMoviePopup();
                  }}
                >
                  Submit
                </button>
                <button
                  className="ml-2 bg-red-500 text-white p-2 rounded-md"
                  onClick={toggleUpdateMoviePopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayData;
