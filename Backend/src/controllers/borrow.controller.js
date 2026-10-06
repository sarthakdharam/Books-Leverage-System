const {BorrowRepository}=require('../repositories/borrow.repository')
const {userRepository}=require('../repositories/user.repository')
const {BookRepository}=require('../repositories/book.repository')

const BorrowBook = async (req,res)=>{
    try{
        const {user_id,book_id}=req.body
        const librarian_id=req.user.userID

        const user = await userRepository.findOneBy({id:user_id})
        if(!user){
            return res.status(404).json({message:'User Not Found'})
        }
        if(user){
            if(user.is_active===false){
                return res.status(404).json({message:'User Not active'})
            }
        }
        
        const book = await BookRepository.findOneBy({id:book_id})
        if(!book){
            return res.status(404).json({message:'Book Not Found'})
        }
        if(book.available_books <= 0){
            return res.status(400).json({message:'No Copies Available of Book'})
        }
        
        const borrowDate = new Date()
        const dueDate = new Date()
        dueDate.setDate(borrowDate.getDate() + 10)

        const newRecord = BorrowRepository.create({
            user,
            book,
            due_date: dueDate,
            status: 'borrowed',
            librarian:{id:librarian_id}
        })
        await BorrowRepository.save(newRecord)

        book.available_books -= 1
        await BookRepository.save(book)

        res.status(201).json(newRecord)

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Error While Borrowing Book', error: err.message})
    }
}


const returnbook=async(req,res)=>{
    try{
        const{user_id,book_id}=req.body
        const librarian_id = req.user.userID 
        const book = await BookRepository.findOneBy({id:book_id})
        if(!book){
            return res.status(404).json({message:'Book Not Found'})
        }
        const record=await BorrowRepository.findOne({
            where:{
                user:{id:user_id},
                book:{id:book_id},
                status:'borrowed'
            },
            relations: {book:true,user:true,librarian:true}
        })

        if(!record){
            return res.status(404).json({message:'No active borrow record found for this user and book'})
        }

        if (record.librarian.id !== librarian_id) {
            return res.status(403).json({ message: 'Only the librarian who issued this book can process its return' })
        }

        const returndate=new Date()
        record.status='returned'
        record.return_date=returndate

        const duedate=new Date(record.due_date)
        if(returndate > duedate){
            const dayslate=Math.ceil((returndate-duedate)/(1000*60*60*24))//convert the millisecond to day
            record.fine_amount=dayslate*5
        }
        await BorrowRepository.save(record)
        
        record.book.available_books +=1
        await BookRepository.save(record.book)

        res.status(200).json(record)
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'Error Returning book',error:err.message})
    }
}

const getmybrowserhistory=async(req,res)=>{
    try{
        const user_id=req.user.userID

        const records=await BorrowRepository.find({
            where:{
                user:{id:user_id}
            },
            relations: {book:true},
            select:{
                id:true,
                borrow_date:true,
                due_date:true,
                return_date:true,
                fine_amount:true,
                status:true,
                book:{
                    id: true,
                    book_name: true,
                    book_author: true,
                    category: true
                }
            },
            order:{borrow_date:'DESC'}
        })

        res.status(200).json(records)
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Error While Fetching Borrow History '})
    }
}

const getBorrowLogs = async (req, res) => {
    try {
        const records = await BorrowRepository.find({
            relations: { user: true, book: true, librarian: true },
            select: {
                id: true,
                borrow_date: true,
                due_date: true,
                return_date: true,
                fine_amount: true,
                status: true,
                user: { id: true, name: true, username: true },
                book: { id: true, book_name: true },
                librarian: { id: true, name: true, branch: true }
            },
            order: { borrow_date: 'DESC' }
        })

        res.status(200).json(records)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error Fetching Borrow Logs', error: err.message })
    }
}

const searchBorrow = async (req, res) => {
    try {
        const { name } = req.query  

        const query = BorrowRepository.createQueryBuilder('borrow')
                                    .leftJoinAndSelect('borrow.book', 'book')
                                    .leftJoinAndSelect('borrow.user', 'user')

        if (name) {
            query.andWhere(
                '(book.book_name ILIKE :term OR user.name ILIKE :term OR borrow.status ILIKE :term OR CAST(borrow.borrow_date AS TEXT) ILIKE :term)',
                { term: `%${name}%` }
            )
        }

        const borrows = await query.orderBy('borrow.borrow_date', 'DESC').getMany()
        res.status(200).json(borrows)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error Searching Borrow data', error: err.message })
    }
}

module.exports = {BorrowBook,returnbook,getmybrowserhistory,getBorrowLogs,searchBorrow}