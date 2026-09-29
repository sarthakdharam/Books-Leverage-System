import { useState,useEffect } from "react"
import { useNavigate,useParams } from "react-router-dom"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header";
import AdminSidebar from "../../components/Adminsidebar";



function UpdateBook({authFetch}){

    const [book_name,setBook_name]=useState('')
    const [book_author,setBook_author]=useState('')
    const [total_books,setTotal_books]=useState(0)
    const [category,setCategory]=useState('')
    const [success,setSuccess]=useState('')
    const [error,setError]=useState('')
    const {id}=useParams()
    const navigate=useNavigate()

    function handlenavigate(){
        return navigate('/books/view')
    }

    async function handleupdatebook(event){
        event.preventDefault()
        setError('')
        setSuccess('')

        if(Number(total_books)<0){
            setError('quantity should be atleast 1')
            return
        }

        try{
            const response=await authFetch(`http://localhost:3000/api/books/${id}`,
                {
                    method:'PATCH',
                    body:JSON.stringify({book_name,book_author,total_books,category})
                }
            )

            const data=await response.json()

            if(!response.ok){
                setError( data.message || 'something failed')
                return
            }

            setSuccess(data.message || 'Book Sucessfully Updated')
            setBook_name('')
            setBook_author('')
            setTotal_books(0)
            setCategory('')

            
        }catch(err){
            console.log(err)
            setError('somethiong went wrong,try Again')
        }
    }

    useEffect(()=>{
        async function loadbooks(){
            try{

            const response = await authFetch('http://localhost:3000/api/books')
            const data=await response.json()

            const foundBook=data.find((book)=>book.id===Number(id))

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
    },[])
    return(
        <div className="dash-container">
            <AdminSidebar/>
            <Header/>                      
            <div className="page-container">
                <form onSubmit={handleupdatebook}>
                    <h3>BOOK NAME:</h3>
                    <input className="form-input" value={book_name} onChange={(e)=>{setBook_name(e.target.value),setError('')}} placeholder="Book Name"/>
                    <h3>BOOK AUTHOR:</h3>
                    <input className="form-input" value={book_author} onChange={(e)=>{setBook_author(e.target.value,setError(''))}} placeholder="Book Author"/>
                    <h3>TOTAL BOOK:</h3>
                    <input className="form-input" value={total_books} type="number" onChange={(e)=>{setTotal_books(e.target.value),setError('')}} placeholder="Total Books"/>
                    <h3>BOOK CATEGORY:</h3>
                    <input className="form-input" value={category}  onChange={(e)=>{setCategory(e.target.value),setError('')}} placeholder="Book Category"/>
                    <br/>
                    <br/>
                    <button className="btn">Submit</button>
                </form>
                <br/>
                {error && <p style={{color:'red'}}>{error}</p>}
                {success && <p style={{color:'green'}}>{success}</p>}
            </div>
        </div>
    )
}
export default withAuthFetch(UpdateBook)