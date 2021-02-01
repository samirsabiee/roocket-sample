require('dotenv').config();
const express = require('express');
const { GraphQLUpload } = require('graphql-upload');
const app = express();

const { ApolloServer, gql } = require('apollo-server-express');
const { UserInputError, AuthenticationError, ForbiddenError } = require('apollo-server');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/graphql', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.Promise = global.Promise;

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

app.use(express.static(path.join(__dirname, 'public')));

const userModel = require('./models/user');
const articleModel = require('./models/article');
const commenteModel = require('./models/comment');

let typeDefs = gql `
type Query {
    user(id:String!) : User
    allUsers(page:Int,limit:Int): UserResult
    article(id:String!) : Article
    allArticles:[Article]
}

type Mutation {
    addArticle(title:String,body:String,photo:Upload!):Article
    updateArticle(id:String!,title:String,body:String):Article
    deleteArticle(id:String!):Boolean
    registerUser(name:String!,age:Int!,address:String!,email:String!,password:String!):Token!
    loginUser(email:String!,password:String!):Token!
}

type Token {
    token:String!
    user:User
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
    image:String
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
`;

let resolvers = {
    Query: {
        user: async(parent, args) => await userModel.findById(args.id),
        allUsers: async(parent, args, { user }) => {
            let page = args.page || 1;
            let limit = args.limit || 10;
            if (!user) {
                throw new ForbiddenError('Not Authenticated as user');
            }
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
        article: async(parent, args) => await articleModel.findById(args.id),
        allArticles: async(parent, args) => await articleModel.find({})
    },
    Mutation: {
        addArticle: async(parent, args, { user }) => {

            if (!user) {
                throw new AuthenticationError('User not authenticated!');
            }

            let { createReadStream, filename } = await args.photo;
            const stream = createReadStream();
            let { filePath } = await saveToStorage({ stream, filename });

            let article = await articleModel.create({
                user: "5c46c0d169720e4bc0d05cc8",
                title: args.title,
                body: args.body,
                image: filePath
            });

            return article;
        },
        updateArticle: async(parent, args) => {
            let article = await articleModel.findByIdAndUpdate(args.id, {...args });
            if (!article) throw new Error('article Not Exist!');
            return article;
        },
        deleteArticle: async(parent, args) => {
            let article = await articleModel.findByIdAndRemove(args.id);
            if (!article) throw new Error('article Not Exist!');
            return true;
        },
        registerUser: async(parent, { name, age, address, email, password }) => {
            let user = await userModel.create({
                name,
                age,
                address,
                email,
                password: userModel.hashPassword(password)
            })
            return { token: userModel.createToken(user, process.env.TOKEN_SECRET, "2h"), user }
        },
        loginUser: async(parent, { email, password }) => {
            let user = await userModel.findOne({ 'email': email });

            if (!user) {
                throw new UserInputError("User Not Found")
            }

            let isValid = user.comparePassword(password);

            if (!isValid) {
                throw new AuthenticationError("Invalid Password");
            }

            return {
                token: userModel.createToken(user, process.env.TOKEN_SECRET, "2h"),
                user
            }
        }
    },
    User: {
        articles: async(parent, args) => await articleModel.find({ user: parent.id })
    },
    Article: {
        user: async(parent, args) => await userModel.findById(parent.user),
        comments: async(parent, args) => await commenteModel.find({ article: parent.id, approved: true })
    },
    Comment: {
        user: async(parent, args) => await userModel.findById(parent.user),
        article: async(parent, args) => await commenteModel.findById(parent.article)
    }
}

let saveToStorage = ({ stream, filename }) => {
    let time = new Date();
    const fileDir = `/upload/${time.getFullYear()}`;
    mkdirp.sync(path.join(__dirname, `/public/${fileDir}`));

    let filePath = `${fileDir}/${filename}`;

    return new Promise((resolve, reject) => {
        stream
            .pipe(fs.createWriteStream(path.join(__dirname, `/public/${filePath}`)))
            .on('error', error => reject(error))
            .on('finish', () => resolve({ filePath }))
    })
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async({ req }) => {
        let user = await userModel.checkToken(req);
        return {
            user
        }
    }
});
server.applyMiddleware({ app });
app.listen(process.env.PORT, () => console.log(`server running on port ${process.env.PORT}`));