const {
    makeExecutableSchema
} = require('graphql-tools');

const resolvers = require('./resolvers');

const typeDefs = `
    type Post {
        id: ID!
        titulo: String!
    }

    type User{
        id: ID!
        nome: String!
        email: String
    }
    type Query{
        allPosts: [Post!]! 
    }
    type Mutation{
        createPost(titulo: String!) : Post
        createUser(nome: String!, authProvider: AuthProviderSignupData!) : User
        signinUser(email: AUTH_PROVIDER_EMAIL) : SigninPayload
    }

    type SigninPayload{
        token: String
        user: User
    }

    input AuthProviderSignupData{
        email: AUTH_PROVIDER_EMAIL
    }

    input AUTH_PROVIDER_EMAIL{
        email: String!
        password: String!  
    }
 `;


module.exports = makeExecutableSchema({
    typeDefs,
    resolvers
});