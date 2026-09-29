const {AdminRepository}=require('../repositories/admin.repository')
const {userRepository}=require('../repositories/user.repository')
const {librarianRepository}=require('../repositories/librarian.repository')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


async function login(req,res){
    try{
        const {username,password}=req.body
//***************************************************/ 
// ADMIN LOGIN CODE
// **************************************************/        
        const admin = await AdminRepository.findOne({
            where:{ username:username },
            select:{ id:true, username:true, password:true }
        });
        if (admin) {
            //PASSWORD COMPARE
            const isMatch = await bcrypt.compare(password,admin.password)
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            // Access Token Based on JWT
            const accessToken=jwt.sign(
                {
                    userID:admin.id,
                    role:'admin'
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:'15m'
                }
            )
            // Refresh Token Based On JWT
            const refreshToken=jwt.sign(
                {
                    userId:admin.id,
                    role:'admin'
                },
                process.env.REFRESH_SECRET,
                {
                    expiresIn:'7d'
                }
            )    
            return res.status(200).json({ message: 'Admin login successfully', role: 'ADMIN' ,accessToken :accessToken, refreshToken:refreshToken});
        }
//***************************************************/ 
// LABRARAIAN LOGIN CODE
// **************************************************/        

        const librarian = await librarianRepository.findOne({
            where:{ username },
            select:{ id:true, username:true, password:true, name:true, email:true, branch:true ,is_active:true}
        })
        if(librarian){
            if(!librarian.is_active){
                return res.status(403).json({message:'This account has been deactivated'})
            }
            //PASSWORD COMPARE
            const isMatch = await bcrypt.compare(password,librarian.password)
            if(!isMatch){
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            // Access Token Based on JWT
            const accessToken=jwt.sign(
                {
                    userID:librarian.id,
                    role:'librarian'
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:'15m'
                }
            )
            // Refresh Token Based On JWT
            const refreshToken=jwt.sign(
                {
                    userId:librarian.id,
                    role:'librarian'
                },
                process.env.REFRESH_SECRET,
                {
                    expiresIn:'7d'
                })
            return res.status(200).json({message:`librarian login successfully`, role:'LIBRARIAN',accessToken:accessToken,refreshToken:refreshToken})
        }
//***************************************************/ 
// USER LOGIN CODE
// **************************************************/
        const user = await userRepository.findOne({
            where:{ username },
            select:{ id:true, username:true, password:true, name:true, email:true, phone:true,is_active:true }
        });
        if(user){
            if(!user.is_active){
                return res.status(403).json({message:'This account has been deactivated'})
            }
            //PASSWORD COMPARE
            const isMatch= await bcrypt.compare(password , user.password)
            if(!isMatch){
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            // Access Token Based on JWT
            const accessToken=jwt.sign(
                {
                    userID:user.id,
                    role:'user'
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:'15m'
                }
            )
            // Refresh Token Based On JWT
            const refreshToken=jwt.sign(
                {
                    userId:user.id,
                    role:'user'
                },
                process.env.REFRESH_SECRET,
                {
                    expiresIn:'7d'
                })
            return res.status(200).json({message:`User login successfully`, role:'USER',accessToken:accessToken,refreshToken:refreshToken})
        }

        return res.status(401).json({ message: 'Invalid username or password' });
    }catch(err){
        console.log(err)
        return res.status(500).json({message:`server error`})
    }
}
module.exports={login}