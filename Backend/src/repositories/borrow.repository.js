const {AppDataSource}=require('../config/database')
const {Borrow}=require('../entities/borrow.entity')


const BorrowRepository=AppDataSource.getRepository(Borrow)

module.exports = {BorrowRepository};
