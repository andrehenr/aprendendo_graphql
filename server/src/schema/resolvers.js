module.exports = {
    Query: {
        allPosts: async (root, data, {
            mongo: {
                Posts
            }
        }) => {
            return await Posts.find({}).toArray();
        },
    },
    Mutation: {
        createPost: async (root, data, {
            mongo: {
                Posts
            }
        }) => {
            const response = await Posts.insertOne(data);
            return Object.assign({
                id: response.insertedId
            }, data)
        },
        createUser: async (root, data, {
            mongo: {
                Users
            }
        }) => {
            const newUser = {
                nome: data.nome,
                email: data.authProvider.email.email,
                password: data.authProvider.email.password
            }
            const response = await Users.insertOne(newUser);
            return Object.assign({
                id: response.insertedId
            }, newUser)
        },
        signinUser: async (root, data, {
            mongo: {
                Users
            }
        }) => {
            const user = await Users.findOne({
                email: data.email.email
            })
            if (data.email.password === user.password) {
                return {
                    token: `token-${user.email}`,
                    user
                }
            }
        }
    },
    Post: {
        id: root => root._id || root.id
    },
    User: {
        id: root => root._id || root.id
    }
}