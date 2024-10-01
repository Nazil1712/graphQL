import { userList, movieList } from "../data.js";
import _ from "lodash";

/*

*** GRAPH for parent Identification ***

    query -> 
        users -> 
            favouriteMovies

    - query's parent = undefined
    - user's parent = undefined [because query(in general) does not return anything !]
    - favouriteMovies's parent = users  [because parent of favouriteMovies is users and it returns users]

*/
export const resolvers = {
  Query: {
    // User Resolvers
    users: (parent, args, context, info) => {
      // console.log("Context",context)
      // console.log("Request Headers",context.req.headers)
      // console.log("Information abou GraphQL query",info)

      if (userList) {
        return { users: userList };
      }
      return { message: "There was an error" };
    },
    user: (parent, args) => {
      // console.log("Args",args)
      const id = args.id;
      const user = _.find(userList, { id: Number(id) });
      return user;
    },

    // Movie Resolvers
    movies: () => {
      if (movieList) {
        return { movies: movieList };
      }
      return { message: "There is an error" };
    },

    movie: (parent, args) => {
      const name = args.name;
      const movie = _.find(movieList, { name: name });
      return movie;
    },
  },

  Mutation: {
    createUser: (parent, args) => {
      console.log("Parent from createUser", parent);
      const newUser = args.input;
      const lastUserId = userList[userList.length - 1].id;
      newUser.id = lastUserId + 1;
      userList.push(newUser);
      // console.log(newUser)
      return newUser;
    },

    updateUser: (parent, args) => {
      const update = args.update;
      const index = userList.findIndex((user) => user.id == update.id);
      const oldUser = userList[index];
      const updatedUser = { ...oldUser, ...update };
      // console.log(updatedUser)
      userList[index] = updatedUser;
      return updatedUser;
    },

    deleteUser: (parent, args) => {
      const id = args.id;
      _.remove(userList, (v, i, arr) => v.id == id);
      return null;
    },

    createMovie: (parent, args) => {
      const newMovie = args.input;
      const lastMovieId = movieList[movieList.length - 1].id;
      newMovie.id = lastMovieId + 1;
      movieList.push(newMovie);
      // console.log(newMovie)
      return newMovie;
    },

    updateMovie: (parent, args) => {
      const update = args.update;
      const index = movieList.findIndex((movie) => movie.id == update.id);
      const oldMovie = movieList[index];
      const updatedMovie = { ...oldMovie, ...update };
      // console.log(updatedMovie)
      movieList[index] = updatedMovie;
      return updatedMovie;
    },

    deleteMovie: (parent, args) => {
      const id = args.id;
      _.remove(movieList, (movie, index, arr) => movie.id == id);
      return null;
    },
  },

  // Resolvers for type User (Name of resolver object should be equal to the name of SchemaType)
  User: {
    favouriteMovies: () => {
      return _.filter(movieList, (v, i, list) => {
        return v.yearOfPublication >= 2010 && v.yearOfPublication <= 2020;
      });
    },
  },

  UsersResult: {
    __resolveType(obj) {
      if (obj.users) {
        return "UsersSuccessfullResult"; // UsersList
      }

      if (obj.message) {
        console.log("Error", obj.message);
        return "UsersErrorResult"; // Error from database OR API Error that has been handled
      }

      /* 
          If none of the above is true, then there will be some another error may be graphQL validation error 
          OR anything else, SO in that case, we will return null
          Beacuse We neither want to invoke UsersSuccessfullResult nor UsersErrorResult
      */
      return null;
    },
  },

  MoviesResult: {
    __resolveType(obj) {
      if (obj.movies) {
        return "MoviesSuccessResult";
      }

      if (obj.message) {
        return "MoviesErrorResult";
      }

      return null;
    },
  },
};
