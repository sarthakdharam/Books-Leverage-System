import { useState } from "react"
import { toast } from "react-toastify"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header"
import AdminSidebar from "../../components/Adminsidebar"


function CreateBook({authFetch}){

    const [book_name,setBook_name]=useState('')
    const [book_author,setBook_author]=useState('')
    const [total_books,setTotal_books]=useState(0)
    const [category,setCategory]=useState('')
    const [book_image,setBook_Image]=useState('')


    async function handlecreatebook(event){
        event.preventDefault()

        if(book_name.trim()===''){
            toast.error('Enter the book name')
            return
        }

        if(book_author.trim()===''){
            toast.error('Enter the book author')
            return
        }


        if(Number(total_books)<=0){
            toast.error('Quantity of book should be atleast 1')
            return
        }

        if(category.trim()===''){
            toast.error('Enter the book category')
            return
        }

        if(book_image.trim()===''){
            toast.error('Enter the  link for book cover')
            return
        }


        
        try{
            const response=await authFetch('http://localhost:3000/api/books',
                {
                    method:'POST',
                    body:JSON.stringify({book_name,book_author,total_books,available_books:total_books,category,book_image})
                }
            )

            const data=await response.json()

            if(!response.ok){
                toast.error( data.message || 'something failed')
                return
            }

            toast.success(data.message || 'Book Sucessfully created')
            setBook_name('')
            setBook_author('')
            setTotal_books(0)
            setCategory('')
            setBook_Image('')
            
        }catch(err){
            console.log(err)
            toast.error('somethiong went wrong,try Again')
        }
    }
    return(
        <div className="dash-container">
            <AdminSidebar/>
            <Header/>                      
                    
            <div className="page-container">
                <form onSubmit={handlecreatebook}>
                    <h3>BOOK NAME:</h3>
                    <input className="form-input" value={book_name} onChange={(e)=>setBook_name(e.target.value)} placeholder="Book Name"/>
                    <h3>BOOK AUTHOR:</h3>
                    <input className="form-input" value={book_author} onChange={(e)=>setBook_author(e.target.value)} placeholder="Book Author"/>
                    <h3>TOTAL BOOK:</h3>
                    <input className="form-input" value={total_books} type="number" onChange={(e)=>setTotal_books(e.target.value)} placeholder="Total Books"/>
                    <h3>BOOK Category:</h3>
                    <input className="form-input" value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Book Category"/>
                    <h3>BOOK Cover:</h3>
                    <input className="form-input" value={book_image} onChange={(e)=>setBook_Image(e.target.value)} placeholder="Book Cover Link"/>
                    <br/>
                    <button className="btn">Submit</button>
                </form>
            </div>
        </div>
    )
}
export default withAuthFetch(CreateBook)