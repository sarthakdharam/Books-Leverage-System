import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header"
import AdminSidebar from "../../components/Adminsidebar"

function ViewBook({authFetch}){
    const [booklist,setBookList]=useState([])
    const navigate=useNavigate()
   
   
    
    async function handleviewbook(){

        try{

            const response = await authFetch('http://localhost:3000/api/books')
            const data=await response.json()
            setBookList(data)

        }catch(err){
            console.log(err)
            toast.error('somethiong went wrong,try Again')
        }
    } 

    async function deactivate(id){
        try{
            const response=await authFetch(`http://localhost:3000/api/books/${id}/deactivate`,
                {
                    method:'PATCH'
                }
            )
            const data= await response.json()

            if(!response.ok){
                toast.error('Issue with data fetching')
                return
            }

            setBookList(prevlist=>
                prevlist.map(b=>b.id===id? {...b, is_active:false} : b)
            )
            
        }catch(err){
            console.log(err)
            toast.error('Book is still active')
        }
    } 

    useEffect(() => {
        handleviewbook()
        
    }, [])

    function handleupdate(id){
        return navigate(`/books/update/${id}`)
    }

    return(
        <div className="dash-container">
            <AdminSidebar/>
            <Header/>                      
                    
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cover</th>
                            <th>Name</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Total Copies</th>
                            <th>Available Copies</th>
                            <th>Status</th>
                            <th>Update</th>
                            <th>Active_status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {booklist.map(book=>(
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>
                                    <img
                                        src={book.book_image || 'https://via.placeholder.com/40x56?text=No+Cover'}
                                        alt={book.book_name}
                                        className="book-thumb"
                                    />
                                </td>
                                <td>{book.book_name}</td>
                                <td>{book.book_author}</td>
                                <td>{book.category}</td>
                                <td>{book.total_books}</td>
                                <td>{book.available_books}</td>
                                <td>{book.is_active ? 'Active' : 'Inactive'}</td>
                                <td>
                                    <button className='btn' onClick={()=>handleupdate(book.id)}>Update</button>
                                </td>
                                <td>
                                    <button className="btn" disabled={!book.is_active} onClick={() => deactivate(book.id)}>
                                        {book.is_active ? 'Deactivate' : 'Deactivated'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>  
       </div>
    )
}

export default withAuthFetch(ViewBook)