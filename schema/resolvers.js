import { userList, movieList } from "../data.js"
import _ from "lodash";

export const resolvers = {
    Query: {
        // User Resolvers
        users : ()=>{
            return userList;
        },
        user: (parent, args) =>{
            const id = args.id
            const user = _.find(userList,{id:Number(id)})
            return user
        },

        // Movie Resolvers
        movies: () =>{
            return movieList
        },

        movie: (parent, args) =>{
            const name = args.name;
            const movie = _.find(movieList,{name: name})
            return movie;
        }
    },

    // Resolvers for type User (Name of resolver object should be equal to the name of SchemaType)
    User: {
        favouriteMovies : ()=> {
            return _.filter(movieList,(v,i,list)=>{
                return v.yearOfPublication >= 2010 && v.yearOfPublication <= 2020
            })
        }
    }
}