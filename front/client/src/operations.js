import gql from 'graphql-tag';

export const Post = {
    all: gql `
        query AllPosts{
            allPosts{
                id
                titulo
            }
        }
    `,
    create: gql `
        mutation CreatePost($titulo: String!, $autorId: ID!){
            createPost(titulo: $titulo, autorId: $autorId){
                id
                titulo
            }
        }
    `,
    update: gql `
        mutation UpdatePost($titulo: String!, $id: ID!){
            updatePost(id: $id, titulo: $titulo){
                id
                titulo
            }
        }
    `,
    remove: gql `
        mutation DeletePost($id: ID!){
            deletePost(id: $id){
                id    
            }
        }
    `,
    subscription: gql `
        subscription newPosts{
            Post(filter: {
                mutation_in: [UPDATED, DELETED, CREATED]
            }){
                mutation
                previousValues{
                    id
                    titulo
                } 
                node{
                    id
                    titulo
                } 
            }
        }
    `
}

const Operation = {
    Post
}

export default Operation;