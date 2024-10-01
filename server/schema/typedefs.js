import { gql } from "apollo-server";

export const typeDefs = gql`

    type User  {
        id : ID!
        name: String!
        username: String!
        age: Int
        nationality: Nationality!
        friends: [User!]
        favouriteMovies: [Movie!]
    }

    type Movie { 
        id: ID!
        name: String!
        yearOfPublication: Int!
        isInTheaters: Boolean!
    }

    input CreateUserInput {
        name: String!
        username: String!
        age: Int = 18 
        nationality: Nationality!
    }

    input UpdateUserInput {
        id: ID!
        name: String
        username: String
        age: Int
        nationality: Nationality
    }


    input CreateMovieInput {
        name: String!
        yearOfPublication: Int!
        isInTheaters: Boolean!
    }

    input UpdateMovieInput {
        id: ID!
        name: String
        yearOfPublication: Int
        isInTheaters: Boolean
    }

    type Mutation {
        createUser(input: CreateUserInput!): User!
        updateUser(update: UpdateUserInput!): User!
        deleteUser(id: ID!): User
        createMovie(input: CreateMovieInput!): Movie!
        updateMovie(update: UpdateMovieInput!): Movie!
        deleteMovie(id: ID!): Movie
    }

    type Query {
        users : UsersResult
        user(id: ID!): User!
        movies : MoviesResult
        movie(name: String!): Movie!
    }

    enum Nationality {
        BRITISH
        MEXICAN
        ITALIAN
        CHINESE
        PAKISTANI
        CANADIAN
        SPANISH
        RUSSIAN
        INDIAN
        ARGENTINIAN
        AUSTRALIAN
        JAPANESE
        EGYPTIAN
        BRAZILIAN
        GERMAN
        MOROCCAN
        AMERICAN
        PORTUGUESE
    }


    # Union for users
    type UsersSuccessfullResult {
        users: [User!]!
    }

    type UsersErrorResult {
        message : String!
    }

    union UsersResult = UsersSuccessfullResult | UsersErrorResult



    # Union for Movies
    type MoviesSuccessResult {
        movies : [Movie!]!
    }

    type MoviesErrorResult {
        message : String!
    }

    union MoviesResult = MoviesSuccessResult | MoviesErrorResult


`;
