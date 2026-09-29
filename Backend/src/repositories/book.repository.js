const {AppDataSource}=require('../config/database')
const {Book}=require('../entities/book.entity')


const BookRepository=AppDataSource.getRepository(Book)

module.exports={BookRepository};
