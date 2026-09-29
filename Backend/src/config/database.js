const {DataSource}=require('typeorm')

const {Admin}=require('../entities/admin.entity.js')
const {librarian}=require('../entities/librarian.entity.js')
const {User}=require('../entities/User.entity.js')
const {Book}=require('../entities/book.entity.js')
const {Borrow}=require('../entities/borrow.entity.js')

const AppDataSource=new DataSource({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'postgres',
    password:'password',
    database:'Library_Management',
    synchronize:true,
    logging:false,
    entities:[
        User,Book,Borrow,Admin,librarian
    ]
})
module.exports={AppDataSource};