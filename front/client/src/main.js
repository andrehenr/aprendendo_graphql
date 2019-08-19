import Vue from 'vue/dist/vue';
import VueApollo from 'vue-apollo';
import {
    ApolloClient,
    HttpLink,
    InMemoryCache
} from 'apollo-client-preset';
import Operation from './Operations';
import {
    split
} from 'apollo-link';
import {
    WebSocketLink
} from 'apollo-link-ws';
import {
    getMainDefinition
} from 'apollo-utilities';

var httpLink = new HttpLink({
    uri: 'https://api.graph.cool/simple/v1/cjzbrluv5288n01892127fp98'
});

var wsLink = new WebSocketLink({
    uri: 'wss://subscriptions.graph.cool/v1/cjzbrluv5288n01892127fp98',
    options: {
        reconnect: true
    }
});

var link = split(
    ({
        query
    }) => {
        const {
            kind,
            operation
        } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
)

//Objeto do ApolloClient para a comunicação com o graphcool
const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})

new Vue({
    el: '#app',
    apolloProvider,
    data: {
        allPosts: [],
        newTitle: ''
    },
    methods: {
        create: function () {
            const title = this.newTitle;
            this.newTitle = '';
            if (title) {
                this.$apollo.mutate({
                    mutation: Operation.Post.create,
                    variables: {
                        titulo: title,
                        autorId: 'cjzcp92p90o1w0146vbiizeq1'
                    },
                    /* update: (store, {
                        data: {
                            createPost
                        }
                    }) => {
                        var data = store.readQuery({
                            query: Operation.Post.all
                        });
                        data.allPosts.push(createPost);
                        store.writeQuery({
                            query: Operation.Post.all,
                            data
                        });
                    } */
                });
            } else {
                window.alert('New title need a value');
            }
        },
        edit: function (post) {
            var newTitle = window.prompt('Update Post', post.titulo);
            if (newTitle) {
                var newPost = Object.assign([], post, {
                    titulo: newTitle
                });
                this.update(newPost);
            } else {
                window.alert('New title need a value');
            }
        },
        update: function (post) {
            this.$apollo.mutate({
                mutation: Operation.Post.update,
                variables: {
                    titulo: post.titulo,
                    id: post.id
                }
            })
        },
        remove: function (post) {
            this.$apollo.mutate({
                mutation: Operation.Post.remove,
                variables: {
                    id: post.id
                },
                /* update: (store, {
                    data: {
                        deletePost
                    }
                }) => {
                    var data = store.readQuery({
                        query: Operation.Post.all
                    });
                    var item = data.allPosts.find(item => item.id === deletePost.id);
                    var itemIndex = data.allPosts.indexOf(item);
                    data.allPosts.splice(itemIndex, 1);
                    store.writeQuery({
                        query: Operation.Post.all,
                        data
                    });
                } */
            })
        }
    },
    apollo: {
        allPosts: {
            query: Operation.Post.all,
            subscribeToMore: {
                document: Operation.Post.subscription,
                updateQuery: (prev, {
                    subscriptionData
                }) => {
                    if (subscriptionData.data.Post.mutation === 'CREATED') {
                        return {
                            allPosts: [...prev.allPosts, subscriptionData.data.Post.node]
                        }
                    } else if (subscriptionData.data.Post.mutation === 'DELETED') {
                        var item = prev.allPosts.find(item => item.id === subscriptionData.data.Post.previousValues.id);
                        var itemIndex = prev.allPosts.indexOf(item);
                        var newPostsList = [...prev.allPosts];
                        newPostsList.splice(itemIndex, 1);
                        return {
                            allPosts: newPostsList
                        }
                    }
                }
            }
        },
        $subscribe: {
            postAdded: {
                query: Operation.Post.subscription,
                result: function (response) {
                    console.log(response);
                }
            }
        }
    }
});