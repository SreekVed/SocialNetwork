const { ApolloServer } = require('apollo-server')
const gql = require('graphql-tag')
const mongoose = require('mongoose')

const { MONGODB } = require('./config')
const Post = require('./models/Post')

const typeDefs = gql`
    type Query {
        getPosts : [Post]
    }

    type Post {
        id : ID!,
        body : String!,
        createdAt : String!,
        username : String!
    }

`

const resolvers = {
    Query : {
        async getPosts(){
            try {
                return posts = await Post.find()
            }
            catch(err) {
                console.log(err)
                throw new Error(err)
            }
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})

mongoose.connect(MONGODB, {useNewUrlParser : true}).then(() => {    
    return server.listen({port : 5000})
    }
).then(
    res => console.log(`Server running at ${res.url}`)
)