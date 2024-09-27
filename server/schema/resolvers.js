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


    Mutation: { 
        createUser : (parent, args) =>{
            const newUser = args.input
            const lastUserId = userList[userList.length - 1].id
            newUser.id = lastUserId + 1
            userList.push(newUser)
            console.log(newUser)
            return newUser
        },


        updateUser : (parent, args) =>{
            const update = args.update
            const index = userList.findIndex((user)=>user.id==update.id)
            const oldUser = userList[index]
            const updatedUser = {...oldUser, ...update}
            console.log(updatedUser)
            userList[index] = updatedUser
            return updatedUser
        },

        
        deleteUser: (parent, args) =>{
            const id = args.id
            _.remove(userList,(v,i,arr)=>v.id==id);
            return null;
        }
    },

    // Resolvers for type User (Name of resolver object should be equal to the name of SchemaType)
    User: {
        favouriteMovies : ()=> {
            return _.filter(movieList,(v,i,list)=>{
                return v.yearOfPublication >= 2010 && v.yearOfPublication <= 2020
            })
        },
    },

    
}