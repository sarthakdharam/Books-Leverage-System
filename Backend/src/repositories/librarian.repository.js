const {AppDataSource}=require('../config/database')
const {librarian}=require('../entities/librarian.entity')


const librarianRepository=AppDataSource.getRepository(librarian)

module.exports={librarianRepository};
