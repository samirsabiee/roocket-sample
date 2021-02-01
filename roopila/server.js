const express = require('express');
const app = express();

const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql `

    type Query {
        user(id:String!):User
        users(page:Int,limit:Int):UsersResult
        profile(id:String!):Profile
        profile(user_id:String!):Profile
        paymentById(id:String!):Payment
        paymentsByUserId(user_id:String!,page:Int,limit:Int):PaymentsResult
        paymentsByOrderId(order_id:String!,page:Int,limit:Int):PaymentsResult
        service(id:String!):Service
        services(id:String!,page:Int,limit:Int):ServicesResult
        order(id:String!):Order
        ordersByUserId(user_id:String!,page:Int,limit:Int):OrdersResult
        newsById(id:String!):NewsResult
        newsByCategoryId(categoryId:String!):NewsResult
        categories:CategoriesResult

    }

    type User {
        fname:String
        lname:String
        mobile:String
        email:String
        token:String
        role:Int
        profile:Profile
        orders:[Order]
        payments:[Payment]
        createdAt:String
        updatedAt:String
    }

    type UsersResult {
        users:[User]
        paginate:Paginate
    }

    type Paginate {
        total:Int
        limit:Int
        page:Int
        pages:Int
    }

    type Profile {
        id:String
        user_id:String
        address:[String]
        melicode:String
        gender:String
        avatar:String
        birthDate:String
        businessField:String
        bio:String
        website:String
        socialMedial:[String]
        accountType:String
        companyName:String
        companyId:String
        companyBranchAddress:[String]
        companyManagerName:String
        companyField:String
        companyPhone:String
        companyFax:String
        profileStatus:Int
        createdAt:String
        updatedAt:String
    }

    type Payment {
        user_id:String
        order_id:String
        user:User
        order:Order
        user_ip:String
        pursuitNumber:String
        amountPay:String
        paymentStatus:Int
        cardNumber:Int
        cardShaba:String
        bankPortId:Int
        createdAt:String
        updatedAt:String
    }

    type PaymentsResult {
        payments:[Payment]
        paginate:paginate
    }

    type Service {
        name
        images:[String]
        expert:String
        content:String
        mainSteps:[String]
        subBranches:[String]
        moreOption:[String]
        createdAt:String
        updatedAt:String
    }

    type ServicesResult {
        services:[Service]
        paginate:Paginate
    }

    type Order {
        id:String
        user_id:String
        user:User
        payment:PaymentResult
        itemName:String
        itemCount:Int
        itemWeight:String
        itemVolume:String
        itemSample:[String]
        status:Int
        inquiryAmount:Int
        finalAmount:Int
        createdAt:String
        updatedAt:String
    }

    type OrdersResult {
        orders:[Order]
        paginate:Paginate
    }

    type News {
         title:String
         content:String
         images:[String]
         category:Category
         categoryId:String
         tags:[String]
         views:Int
         createdAt:String
         updatedAt:String
    }

    type NewsResult {
        news:[News]
        paginate:Paginate
    }

    type Category {
        id:String
        name:String
        news:NewsResult
        createdAt:String
        updatedAt:String
    }

    type CategoriesResult {
        categories:[Category]
        paginate:Paginate
    }

`

require('./models');