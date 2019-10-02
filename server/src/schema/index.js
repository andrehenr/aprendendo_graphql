const {
    makeExecutableSchema
} = require('graphql-tools');

const resolvers = require('./resolvers');

const typeDefs = `
    type Post {
        id: ID!
        titulo: String!
        autor: User
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
        updatePost(titulo: String, id: ID!) : Post
        deletePost(id: ID!) : Post
        createUser(nome: String!, authProvider: AuthProviderSignupData!) : User
        signinUser(email: AUTH_PROVIDER_EMAIL) : SigninPayload
    }

    type Subscription{
        Post(filter: PostSubscriptionFilter) : PostSubscriptionPayload
    }

    input PostSubscriptionFilter {
        mutation_in: [_ModelMutationType!]
    }

    enum _ModelMutationType {
        CREATED
        UPDATED
        DELETED
    }

    type PostSubscriptionPayload{
        mutation: _ModelMutationType
        node: Post
        previousValues: Post
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