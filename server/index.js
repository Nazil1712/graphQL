import { ApolloServer } from "apollo-server";
import {typeDefs} from "./schema/typedefs.js"
import { resolvers } from "./schema/resolvers.js";

const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({url})=>{
    console.log(`Your API is running ar ${url}`)
});