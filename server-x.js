require('dotenv').config();
const app = require('express')();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/graphql', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.Promise = global.Promise;

const userModel = require('./models/user');
const articleModel = require('./models/article');
const commenteModel = require('./models/comment');

let schema = buildSchema(`
    type Query {
        user(id:String!) : User
        allUsers(page:Int,limit:Int): UserResult
        article(id:String!) : Article
        allArticles:[Article]
    }

    type UserResult {
        user: [User]
        paginate:Paginate
    }

    type Paginate {
        total:Int
        limit:Int
        page:Int
        pages:Int
    }

    type User {
        name:String,
        age:Int,
        admin:Boolean,
        email:String,
        address:String
        articles:[Article]
    }

    type Article {
        user:User
        comments:[Comment]
        title:String
        body:String
        createdAt:String
        updatedAt:String
    }

    type Comment {
        user:User
        approved:Boolean
        article:Article
        comment:String
        createdAt:String
        updatedAt:String
    }
`);

let resolver = {
    user: async(args) => await userModel.findById(args.id).populate('articles').exec(),
    allUsers: async(args) => {
        let page = args.page || 1;
        let limit = args.limit || 10;
        let users = await userModel.paginate({}, { page, limit });
        return {
            user: users.docs,
            paginate: {
                total: users.total,
                limit: users.limit,
                page: users.page,
                pages: users.pages
            }
        };
    },
    article: async(args) => await articleModel.findById(args.id).populate(['user']).exec(),
    allArticles: async() => await articleModel.find({}).populate(['user', {
        path: 'comments',
        match: {
            approved: true,
        },
        populate: ['user']
    }])
}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true
}));

app.listen(process.env.PORT, () => console.log(`server running on port ${process.env.PORT}`));