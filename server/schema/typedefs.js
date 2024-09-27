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

    input createUserInput {
        name: String!
        username: String!
        age: Int = 18 
        nationality: Nationality!
    }

    input updateUserInput {
        id: ID!
        name: String
        username: String
        age: Int
        nationality: Nationality
    }

    type Mutation {
        createUser(input: createUserInput!): User!
        updateUser(update: updateUserInput!): User!
        deleteUser(id: ID!): User
    }

    type Query {
        users : [User!]!
        user(id: ID!): User!
        movies : [Movie!]!
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
`;
