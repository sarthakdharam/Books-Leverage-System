const {AppDataSource}=require('../config/database')
const {Admin}=require('../entities/admin.entity')


const AdminRepository=AppDataSource.getRepository(Admin)

module.exports={AdminRepository};
