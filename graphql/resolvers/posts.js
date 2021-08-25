const Post = require('../../models/Post')

module.exports = {
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