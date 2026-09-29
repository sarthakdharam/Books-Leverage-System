const {userRepository}=require('../repositories/user.repository')
const {librarianRepository}=require('../repositories/librarian.repository')
const {BookRepository}=require('../repositories/book.repository')
const {BorrowRepository}=require('../repositories/borrow.repository')

const getstats=async (req,res)=>{
    try{

        const [total_books,avctive_book,total_librarian,active_librarian,total_users,active_users,book_issued_count,deleted_member]=
        await Promise.all([
            BookRepository.count(),
            BookRepository.count({where:{is_active:true}}),
            librarianRepository.count(),
            librarianRepository.count({where:{is_active:true}}),
            userRepository.count(),
            userRepository.count({where:{is_active:true}}),
            BorrowRepository.count({where:{status:'borrowed'}}),
            userRepository.count({where:{is_active:false}})            
        ])
        res.status(200).json({total_books,avctive_book,total_librarian,active_librarian,total_users,active_users,book_issued_count,deleted_member})
    }catch(err){
        console.lof(err)
        res.status(500).json({message:'Error fetching stats',error:err.message});
        }
    }

module.exports={getstats}