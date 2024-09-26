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
