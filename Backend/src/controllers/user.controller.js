const {userRepository}=require('../repositories/user.repository')
const {AdminRepository}=require('../repositories/admin.repository')
const bcrypt=require('bcrypt')
const {librarianRepository}=require('../repositories/librarian.repository')

const createUser = async (req,res)=>{
    try{
        const {name,username,email,phone,password}=req.body
        const librarian_id = req.user.userID 
        const admin=await AdminRepository.findOneBy({username:username})
        const librarian=await librarianRepository.findOneBy({username:username})

        const user=await userRepository.findOneBy({username:username})
        if(user || admin || librarian){
            console.log('user alredy exist')
            return res.status(409).json({message:'Username already exist'})
        }

        const hashPassword = await bcrypt.hash(password,10)

        const newUser= userRepository.create({
            name,
            username,
            email,
            phone,
            password:hashPassword,
            librarian:{id:librarian_id}
        })
        const savedUser = await userRepository.save(newUser)
        const { password:_ , ...userWithoutPassword } = savedUser;
        return res.status(201).json(userWithoutPassword)
        

    }catch(err){
        console.log(err)
        return res.status(500).json({message:'Error Creating User', error: err.message})
    }
}


const getUserdata=async (req,res)=>{
    try{
        const librarian_id = req.user.userID
        const librarian = await librarianRepository.findOneBy({id: librarian_id})
        if(!librarian){
            return res.status(404).json({ message: 'Librarian Not Found' })
        }
        const userdata=await userRepository.find({
            where:{
                librarian:{id:librarian_id}
            },            
            select:{
                id:true,
                name:true,
                username:true,
                email:true,
                phone:true,         
                is_active:true       
            },
            order: { id: 'ASC' }
        })
        
        res.status(200).json(userdata)
            
    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Error Fetching User Logs', error: err.message })
    }
}

const updatemyaccount=async (req,res)=>{
    try{
        const user_id=req.user.userID

        const user=await userRepository.findOneBy({id:user_id})

        if(!user){
            return res.status(404).json({ message: 'User Not Found' })
        }

        const {name, email, phone, password}=req.body

        if (name) user.name = name
        if (email) user.email = email
        if (phone) user.phone = phone
        if (password) {
            user.password = await bcrypt.hash(password, 10)
        }
        if (req.file) {
            user.user_photo = req.file.buffer
            user.user_photo_mime = req.file.mimetype
        }

        const updatedUser = await userRepository.save(user)
        const { password: _, ...userWithoutPassword } = updatedUser

        res.status(200).json(userWithoutPassword)

    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Error Updating Account', error: err.message })
    }

}

const getmyaccount=async (req,res)=>{
    try{
        const user_id=req.user.userID
        const user=await userRepository.findOne({
            where:{id:user_id},
            select:{
                id:true,
                name:true,
                username:true,
                email:true,
                phone:true, 
                user_photo:true,
                user_photo_mime:true
            }               
        })

        if(!user){
            return res.status(404).json({ message: 'User Not Found' })
        }
        const photo = user.user_photo? `data:${user.user_photo_mime};base64,${user.user_photo.toString('base64')}`: null
        res.status(200).json({...user, user_photo: photo})

    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Error Fetching Account', error: err.message })
    }
}

const deleteuser=async (req,res)=>{
    try{
        const {id}=req.params

        const user=await userRepository.findOneBy({id})

        if(!user){
            return res.status(404).json({message:'User Not Found'})
        }

        user.is_active=false
        await userRepository.save(user)

        res.status(200).json({message:'User deactivated successfully'})

    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Error Deleting User', error: err.message })
    }
}

const activateuser=async (req,res)=>{
    try{
        const {id}=req.params

        const user=await userRepository.findOneBy({id})

        if(!user){
            return res.status(404).json({message:'User Not Found'})
        }

        user.is_active=true
        await userRepository.save(user)

        res.status(200).json({message:'User activated successfully'})

    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Error Deleting User', error: err.message })
    }
}

const searchUsers = async (req, res) => {
    try {
        const { name } = req.query  

        const query = userRepository.createQueryBuilder('user')
            .andWhere('user.is_active = :is_active', { is_active: true })

        if (name) {
            query.andWhere(
                '(user.name ILIKE :term OR user.username ILIKE :term OR user.email ILIKE :term OR CAST(user.phone AS TEXT) ILIKE :term)',
                { term: `%${name}%` }
            )
        }

        const users = await query.orderBy('user.name', 'ASC').getMany()
        res.status(200).json(users)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error Searching Users', error: err.message })
    }
}

const searchUsersByUsername = async (req, res) => {
    try {
        const { username } = req.query

        if (!username?.trim()) {
            return res.status(200).json([])
        }

        const users = await userRepository
            .createQueryBuilder('user')
            .select([
                'user.id',
                'user.name',
                'user.username'
            ])
            .where('user.username ILIKE :username', {
                username: `%${username.trim()}%`
            })
            .andWhere('user.is_active = :active', {
                active: true
            })
            .orderBy('user.username', 'ASC')
            .getMany()

        return res.status(200).json(users)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Error searching users by username'
        })
    }
}
module.exports={createUser,getUserdata,updatemyaccount,getmyaccount,deleteuser,searchUsers,activateuser,searchUsersByUsername}