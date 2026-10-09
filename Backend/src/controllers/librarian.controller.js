
const {librarianRepository}=require('../repositories/librarian.repository')
const {AdminRepository}=require('../repositories/admin.repository')
const bcrypt=require('bcrypt')
const {userRepository}=require('../repositories/user.repository')
const { MoreThanOrEqual, LessThan, Between } = require('typeorm')
const { BorrowRepository } = require('../repositories/borrow.repository')



async function createlibrarian(req,res){
    try{
        const {name,username,email,phone,password,branch}=req.body
        const admin=await AdminRepository.findOneBy({username:username})
        const user=await userRepository.findOneBy({username:username})

        const librarian= await librarianRepository.findOne({where:[{username:username},{email:email},{phone:phone}]})
        if(librarian || admin || user){
            console.log('username is already exists')
            return res.status(409).json({
                message:`Librarian with username '${librarian.username}' or email '${librarian.email}' already exists or phone no. '${librarian.phone}' alredy exists `
            })
        }

        const hashPassword = await bcrypt.hash(password,10)
 
        const librarianauth=librarianRepository.create({
            name,
            username,
            email,
            phone,
            password:hashPassword,
            branch,
            
        })
        const savelabrarain=await librarianRepository.save(librarianauth)
        const { password:_ , ...labWithoutPassword } = savelabrarain
        return res.status(201).json(labWithoutPassword)
        
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'Error while creating librarian',error:err.message})
    }
}


const getlibrariandata=async (req,res)=>{
    try{
        const librariandata=await librarianRepository.find({
            
            select:{
                id:true,
                name:true,
                username:true,
                email:true,
                phone:true, 
                branch:true,
                is_active:true         
            },
            order:{id:'ASC'}
        })

        
        res.status(200).json(librariandata)
        
        
     
    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Error Fetching User Logs', error: err.message })
    }
}

const updatelabrarian=async (req,res)=>{
    try{
        const labrarian_id=req.user.userID

        const labrarian=await librarianRepository.findOneBy({id:labrarian_id})
        if(!labrarian){
            return res.status(404).json({message:'Labrarian Not Found'})
        }


        const  {name,email,phone,password}=req.body

        if(name) labrarian.name=name
        if(email) labrarian.email=email
        if(phone) labrarian.phone=phone
        if(password){
            labrarian.password=await bcrypt.hash(password,10)
        }

        const updatelabrarian=await librarianRepository.save(labrarian)
        const {password:_,...userWithoutPassword}=updatelabrarian

        res.status(200).json(userWithoutPassword)
    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Error Updating Account', error: err.message })
    }
}

const getlabrarianaccount=async (req,res)=>{
    try{
        const librarian_id=req.user.userID
        const librarian=await librarianRepository.findOne({
            where:{id:librarian_id},
            select:{
                id:true,
                name:true,
                username:true,
                email:true,
                phone:true, 
                branch:true,
            }      
        })

        if(!librarian){
            return res.status(404).json({ message: 'librarian Not Found' })
        }
        res.status(200).json(librarian)

    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Error Fetching Account', error: err.message })
    }
}

const deletelabrarian=async (req,res)=>{
    try{
        const {id}=req.params

        const librarian=await librarianRepository.findOneBy({id})

        if(!librarian){
            return res.status(404).json({message:'Librarian Not Found'})
        }

        librarian.is_active=false
        await librarianRepository.save(librarian)

        res.status(200).json({message:'librarian deactivated successfully'})

    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Error Deleting Librarian', error: err.message })
    }
}

const activatelabrarian=async (req,res)=>{
    try{
        const {id}=req.params

        const librarian=await librarianRepository.findOneBy({id})

        if(!librarian){
            return res.status(404).json({message:'Librarian Not Found'})
        }

        librarian.is_active=true
        await librarianRepository.save(librarian)

        res.status(200).json({message:'librarian activated successfully'})

    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Error Deleting Librarian', error: err.message })
    }
}


const getLibrarianStats = async (req, res) => {
    try {
        const librarian_id = req.user.userID

        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const now = new Date()
        const in3Days = new Date()
        in3Days.setDate(in3Days.getDate() + 3)

        const mine = { librarian: { id: librarian_id } }

        const [totalMembers, activeMembers, issuedToday, currentlyBorrowed, overdue, dueSoon] =
            await Promise.all([
                userRepository.count({ where: mine }),
                userRepository.count({ where: { ...mine, is_active: true } }),
                BorrowRepository.count({ where: { ...mine, borrow_date: MoreThanOrEqual(startOfDay) } }),
                BorrowRepository.count({ where: { ...mine, status: 'borrowed' } }),
                BorrowRepository.count({ where: { ...mine, status: 'borrowed', due_date: LessThan(now) } }),
                BorrowRepository.count({ where: { ...mine, status: 'borrowed', due_date: Between(now, in3Days) } }),
            ])

        res.status(200).json({ totalMembers, activeMembers, issuedToday, currentlyBorrowed, overdue, dueSoon })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error fetching stats', error: err.message })
    }
}

const searchLibrarian = async (req, res) => {
    try {
        const { name } = req.query  

        const query = librarianRepository.createQueryBuilder('librarian')
            .andWhere('librarian.is_active = :is_active', { is_active: true })

        if (name) {
            query.andWhere(
                '(librarian.name ILIKE :term OR librarian.username ILIKE :term OR librarian.email ILIKE :term OR CAST(librarian.phone AS TEXT) ILIKE :term)',
                { term: `%${name}%` }
            )
        }

        const librarians = await query.orderBy('librarian.name', 'ASC').getMany()
        res.status(200).json(librarians)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error Searching Users', error: err.message })
    }
}

const getBranches = async (req, res) => {
    try {
        const branches = await librarianRepository.find({
            order: { branch: 'ASC' }
        })

        res.status(200).json(branches)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Error fetching branches'})
    }
}

module.exports={createlibrarian,getlibrariandata,updatelabrarian,getlabrarianaccount,activatelabrarian,deletelabrarian,getLibrarianStats,searchLibrarian,getBranches}