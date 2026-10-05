const {BookRepository}=require('../repositories/book.repository')


const createBook = async (req,res)=>{
    try{
        const {book_name, book_author, total_books, category,book_image}=req.body
        
        if(book_name.trim()===''){
            return res.status(400).json({message:'there should be book name'})
        }

        if(book_author.trim()===''){
            return res.status(400).json({message:'there should be book author'})
        }

        if(category.trim()===''){
            return res.status(400).json({message:'there should be book category'})
        }

        if(Number(total_books)<=0){
            return res.status(400).json({message:'there should be atleast 1 book'})
        }
        if(book_image.trim()===''){
            return res.status(400).json({message:'there should be book image'})
        }

        const book=await BookRepository.findOneBy({book_name:book_name})
        if(book){
            return res.status(409).json({message:'Book alredy exists'})
        }

        const newBook = BookRepository.create({
            ...req.body,
            is_active: true
        })
        const savedBook = await BookRepository.save(newBook)
        res.status(201).json(savedBook)
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Error Creating Book', error: err.message})
    }
}


const searchBooks = async (req, res) => {
    try {
        const { book_name } = req.query  

        const query = BookRepository.createQueryBuilder('book')
            .andWhere('book.is_active = :is_active', { is_active: true })

        if (book_name) {
            query.andWhere(
                '(book.book_name ILIKE :term OR book.book_author ILIKE :term OR book.category ILIKE :term)',
                { term: `%${book_name}%` }
            )
        }

        const books = await query.orderBy('book.book_name', 'ASC').getMany()
        res.status(200).json(books)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error Searching Books', error: err.message })
    }
}

const getAllBooks = async (req, res) => {
    try {
        const role = req.user.role

        let books

        if (role === 'admin') {
            books = await BookRepository.find({
                order: { id: 'ASC' }
            })
        } else {
            books = await BookRepository.find({
                where: { is_active: true },
                order: { id: 'ASC' }
            })
        }

        res.status(200).json(books)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error Fetching Books', error: err.message })
    }
}

const updatebook = async (req, res) => {
    try {
        const { id } = req.params
        const { book_name, book_author, total_books,category } = req.body

        const book = await BookRepository.findOneBy({ id })
        if (!book) {
            return res.status(404).json({ message: 'No Book Found' })
        }

        if (book_name) book.book_name = book_name
        if (book_author) book.book_author = book_author
        if (total_books) {
            book.total_books += total_books
            book.available_books += total_books
        }
        if (category) book.category = category

        const updatedBook = await BookRepository.save(book)
        res.status(200).json(updatedBook)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error Updating Book', error: err.message })
    }
}



const deleteBook = async (req, res) => {
    try {
        const { id } = req.params

        const book = await BookRepository.findOneBy({ id })
        if (!book) {
            return res.status(404).json({ message: 'Book Not Found' })
        }

        book.is_active = false
        await BookRepository.save(book)

        res.status(200).json({ message: 'Book deactivated successfully' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error Deleting Book', error: err.message })
    }
} 

const activateBook = async (req, res) => {
    try {
        const { id } = req.params

        const book = await BookRepository.findOneBy({ id })
        if (!book) {
            return res.status(404).json({ message: 'Book Not Found' })
        }

        book.is_active = true
        await BookRepository.save(book)

        res.status(200).json({ message: 'Book activated successfully' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error Deleting Book', error: err.message })
    }
} 

module.exports = { createBook, searchBooks ,updatebook,deleteBook,getAllBooks,activateBook}