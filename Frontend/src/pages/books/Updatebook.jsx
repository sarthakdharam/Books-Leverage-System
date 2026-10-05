import { useState,useEffect } from "react"
import withAuthFetch from "../../HOC/withAuthFetch"
import { toast } from "react-toastify";



function UpdateBook({authFetch,bookId,onClose,onCreated}){

    const [book_name,setBook_name]=useState('')
    const [book_author,setBook_author]=useState('')
    const [total_books,setTotal_books]=useState(0)
    const [category,setCategory]=useState('')

    async function handleupdatebook(event){
        event.preventDefault()
      

        if(Number(total_books)<0){
            toast.error('quantity should be atleast 1')
            return
        }

        try{
            const response=await authFetch(`http://localhost:3000/api/books/${bookId}`,
                {
                    method:'PATCH',
                    body:JSON.stringify({book_name,book_author,total_books,category})
                }
            )

            const data=await response.json()

            if(!response.ok){
                toast.error( data.message || 'something failed')
                return
            }

            toast.success(data.message || 'Book Sucessfully Updated')
            setBook_name('')
            setBook_author('')
            setTotal_books(0)
            setCategory('')

            onCreated()
            onClose()

            
        }catch(err){
            console.log(err)
            toast.error('somethiong went wrong,try Again')
        }
    }

    useEffect(()=>{
        async function loadbooks(){
            try{

            const response = await authFetch('http://localhost:3000/api/books')
            const data=await response.json()

            const foundBook=data.find((book)=>book.id===Number(bookId))

            if(foundBook){
                setBook_name(foundBook.book_name)
                setBook_author(foundBook.book_author)
                setCategory(foundBook.category)
            }

        }catch(err){
            console.log(err)
        }
        }

        loadbooks()
    },[bookId])
    return(
        <div className="modal-overlay" onClick={onClose}>
                   
            <div className="page-container modal-form" onClick={(e) => e.stopPropagation()}>     
                <div className="form-header"><h3>Update Book</h3> 
                <button type="button" className="close-btn" onClick={onClose}>×</button>
            </div>
                <form onSubmit={handleupdatebook}>
                    <h3>BOOK NAME:</h3>
                    <input className="form-input" value={book_name} onChange={(e)=>setBook_name(e.target.value)} placeholder="Book Name"/>
                    <h3>BOOK AUTHOR:</h3>
                    <input className="form-input" value={book_author} onChange={(e)=>setBook_author(e.target.value)} placeholder="Book Author"/>
                    <h3>TOTAL BOOK:</h3>
                    <input className="form-input" value={total_books} type="number" onChange={(e)=>setTotal_books(e.target.value)} placeholder="Total Books"/>
                    <h3>BOOK CATEGORY:</h3>
                    <input className="form-input" value={category}  onChange={(e)=>setCategory(e.target.value)} placeholder="Book Category"/>
                    <button className="btn">Submit</button>
                </form>
            </div>
        </div>
    )
}
export default withAuthFetch(UpdateBook)