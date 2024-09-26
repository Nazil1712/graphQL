import { userList } from "../data.js"

export const resolvers = {
    Query: {
        users() {
            return userList;
        }
    }
}