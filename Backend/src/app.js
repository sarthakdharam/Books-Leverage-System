require("dotenv").config();
const {AppDataSource}=require('./config/database')
const express=require('express')
const {createUser,getUserdata,updatemyaccount,getmyaccount,deleteuser,searchUsers,activateuser}=require('./controllers/user.controller')
const {createBook,searchBooks,updatebook,deleteBook,getAllBooks,activateBook}=require('./controllers/book.controller')
const {BorrowBook,returnbook,getmybrowserhistory,getBorrowLogs,searchBorrow,searchMyBorrowHistory}=require('./controllers/borrow.controller')
const {createlibrarian,getlibrariandata,updatelabrarian,getlabrarianaccount,activatelabrarian,deletelabrarian,getLibrarianStats,searchLibrarian}=require('./controllers/librarian.controller')
const {login}=require('./controllers/login.controller')
const {refreshAccessToken}=require('./controllers/auth.controller')
const {authenticate}=require('./middleware/authentication.middleware')
const {authorize}=require('./middleware/authorize.middleware')
const {getstats}=require('./controllers/stats.controller')
const cors=require('cors')

const app=express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json());

app.post('/api/login',login)
app.post('/api/refresh-token', refreshAccessToken)
app.post('/api/librarian',authenticate,authorize(['admin']),createlibrarian)
app.post('/api/users',authenticate,authorize(['librarian']),createUser)
app.post('/api/books',authenticate,authorize(['admin']),createBook)
app.post('/api/borrow',authenticate,authorize(['librarian']),BorrowBook)
app.patch('/api/borrow/return',authenticate,authorize(['librarian']),returnbook)
app.get('/api/borrow/history',authenticate,authorize(['user','librarian']),getmybrowserhistory)
app.get('/api/books/search',authenticate,authorize(['user','admin','librarian']),searchBooks)
app.get('/api/borrow/logs', authenticate, authorize(['librarian']), getBorrowLogs)
app.get('/api/users/logs',authenticate, authorize(['librarian']), getUserdata)
app.get('/api/librarian/logs',authenticate, authorize(['admin']), getlibrariandata)
app.patch('/api/librarian/myaccount', authenticate, authorize(['librarian']), updatelabrarian)
app.patch('/api/users/myaccount', authenticate, authorize(['user']), updatemyaccount)
app.get('/api/users/myaccount', authenticate, authorize(['user']), getmyaccount)
app.get('/api/librarian/myaccount', authenticate, authorize(['librarian']), getlabrarianaccount)
app.get('/api/books', authenticate, authorize(['admin','librarian']), getAllBooks)
app.patch('/api/books/:id/deactivate', authenticate, authorize(['admin']), deleteBook)
app.patch('/api/books/:id/activate', authenticate, authorize(['admin']), activateBook)
app.patch('/api/books/:id', authenticate, authorize(['admin']), updatebook)
app.patch('/api/librarian/:id/deactivate', authenticate, authorize(['admin']), deletelabrarian)
app.patch('/api/librarian/:id/activate', authenticate, authorize(['admin']), activatelabrarian)
app.patch('/api/users/:id/deactivate', authenticate, authorize(['librarian']), deleteuser)
app.patch('/api/users/:id/activate', authenticate, authorize(['librarian']), activateuser)
app.get('/api/admin/stats',authenticate,authorize(['admin']),getstats)
app.get('/api/librarian/stats', authenticate, authorize(['librarian']), getLibrarianStats)
app.get('/api/users/search',authenticate,authorize(['librarian']),searchUsers)
app.get('/api/borrow/search',authenticate,authorize(['librarian']),searchBorrow)
app.get('/api/librarian/search',authenticate,authorize(['admin']),searchLibrarian)
app.get('/api/myborrow/search',authenticate,authorize(['user']),searchMyBorrowHistory)

async function start(){
    try{
        await AppDataSource.initialize();
        console.log('Database connected .....')
        
        
        app.listen(3000,()=>{
            console.log('Server running on http://localhost:3000')
        })
    }catch(err){
        console.log(err)
    }
}
start()