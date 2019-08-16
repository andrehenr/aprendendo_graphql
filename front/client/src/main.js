import Vue from 'vue/dist/vue';
import VueApollo from 'vue-apollo';
import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-client-preset';
import Operations from './Operations'
import Operation from './Operations';

var httpLink = new HttpLink({uri: 'https://api.graph.cool/simple/v1/cjzbrluv5288n01892127fp98'});

//Objeto do ApolloClient para a comunicação com o graphcool
const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    connectToDevTools: true
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})

new Vue({el: '#app',
    apolloProvider,
    data:{
       allPosts: [],
       newTitle: ''
    },
    methods:{
      create: function(){
          const title = this.newTitle;
          this.newTitle = '';
          if(title){
              this.$apollo.mutate({
                  mutation: Operations.Post.create,
                  variables: {
                      titulo: title,
                      autorId: 'cjzcp92p90o1w0146vbiizeq1'
                  },
                  update: (store, {data : {createPost }}) => {
                        var data = store.readQuery({query: Operations.Post.all});
                        data.allPosts.push(createPost);
                        store.writeQuery({query: Operations.Post.all,data});
                  }
              });
          }
      },
      edit: function(post){
          var newTitle = window.prompt('Update Post', post.titulo);
          if(newTitle){
              var newPost = Object.assign([], post, {titulo: newTitle});
              this.update(newPost);
            }
      },
      update: function(post){
        this.$apollo.mutate({
            mutation: Operation.Post.update,
            variables: {
                titulo: post.titulo,
                id: post.id
            }
        })
      },
      remove: function(post){
            this.$apollo.mutate({
                mutation: Operations.Post.remove,
                variables: {
                    id:post.id
                }
            })
      }  
    },
    apollo:{
        allPosts:{
            query: Operations.Post.all
        }
    }
});