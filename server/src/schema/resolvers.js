const {ObjectId } = require('mongodb')
const pubsub = require('../pubsub')

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
            }, user
        }) => {
            const newPost = Object.assign({autorId: user && user._id}, data);
            const response = await Posts.insertOne(newPost);
            newPost =  Object.assign({
                id: response.insertedId
            }, newPost)
            pubsub.publish('Post', {Post : { mutation: 'CREATED', previousValues: value }})
            return newPost;
        },
        updatePost: async (root, data, {
            mongo: {
                Posts
            }, user
        }) => {
           data._id = ObjectId(data.id);
           delete data.id;
           const {value} = await Posts.findAndModify({'_id': data._id}, [], {'$set': data}, {new: true})
           pubsub.publish('Post', {Post : { mutation: 'UPDATED', node: value }})
           return value;
        },
        deletePost: async (root, data, {
            mongo: {
                Posts
            }, user
        }) => {
           const id = ObjectId(data.id);
           const {value} = await Posts.findAndModify({'_id': id}, [], {}, {remove: true})
           pubsusb.publish('Post', {Post : { mutation: 'DELETED', previousValues: value }})
           return value;
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
            });
            if (data.email.password === user.password) {
                return {
                    token: `token-${user.email}`,
                    user
                }
            }
        }
    },
    Subscription:{
          Post: {
              subscribe:() => pubsub.assyncIterator('Post')
          }  
    },
    Post: {
        id: root => root._id || root.id,
        autor: async ({autorId}, data, {dataloaders: {userLoader}}) => {
            return await userLoader.load(autorId);
        }
    },
    User: {
        id: root => root._id || root.id
    }
}