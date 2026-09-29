const {AppDataSource}=require('../config/database')
const {Book}=require('../entities/book.entity')

const bookData = [
    {
        book_name: "The Alchemist",
        book_author: "Paulo Coelho",
        total_books: 10,
        available_books: 10,
        category: "Fiction"
    },
    {
        book_name: "Atomic Habits",
        book_author: "James Clear",
        total_books: 15,
        available_books: 15,
        category: "Self Help"
    },
    {
        book_name: "Clean Code",
        book_author: "Robert C. Martin",
        total_books: 8,
        available_books: 8,
        category: "Programming"
    },
    {
        book_name: "The Pragmatic Programmer",
        book_author: "Andrew Hunt",
        total_books: 12,
        available_books: 12,
        category: "Programming"
    },
    {
        book_name: "Rich Dad Poor Dad",
        book_author: "Robert Kiyosaki",
        total_books: 20,
        available_books: 20,
        category: "Finance"
    },
    {
        book_name: "Harry Potter and the Philosopher's Stone",
        book_author: "J.K. Rowling",
        total_books: 10,
        available_books: 10,
        category: "Fantasy"
    },
    {
        book_name: "The Psychology of Money",
        book_author: "Morgan Housel",
        total_books: 14,
        available_books: 14,
        category: "Finance"
    },
    {
        book_name: "1984",
        book_author: "George Orwell",
        total_books: 7,
        available_books: 7,
        category: "Dystopian"
    },
    {
        book_name: "Deep Work",
        book_author: "Cal Newport",
        total_books: 9,
        available_books: 9,
        category: "Productivity"
    },
    {
        book_name: "Introduction to Algorithms",
        book_author: "Thomas H. Cormen",
        total_books: 6,
        available_books: 6,
        category: "Computer Science"
    }
];

const SeedBook= async function (){
    await AppDataSource.initialize()
    const bookRepo= AppDataSource.getRepository(Book)

    for (const data of bookData){
        const exist= await bookRepo.findOneBy({book_name:data.book_name})
        if(!exist){
            const books= bookRepo.create(data)
            await bookRepo.save(books)
            console.log(`Added: ${books}`)
        }else{
            console.log('Book Data is Already Present ')
        }
    }
    console.log('seeding complete')
    process.exit(0)
}
SeedBook()