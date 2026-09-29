const {AppDataSource}=require('../config/database')
const {User}=require('../entities/User.entity')


const userRepository=AppDataSource.getRepository(User)

module.exports={userRepository};
