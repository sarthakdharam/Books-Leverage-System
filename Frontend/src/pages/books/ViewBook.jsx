import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import CreateBook from "./CreateBook"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header"
import AdminSidebar from "../../components/Adminsidebar"
import Updatebook from "./Updatebook"
import ConfirmActivate from "./ConfirmActivate"
import ConfirmDeactivate from "./ConfirmDeactivate"

function ViewBook({authFetch}){
    const [booklist,setBookList]=useState([])
    const [showCreateBook, setShowCreateBook] = useState(false)
    const [showUpdateBook, setShowUpdateBook] = useState(false)
    const [selectedBookId, setSelectedBookId] = useState(null)
    const [showActivateConfirm, setShowActivateConfirm] = useState(false)
    const [showDeativateConfirm, setShowDeactivateConfirm] = useState(false)
   
   
    
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
    async function activate(id){
        try{
            const response=await authFetch(`http://localhost:3000/api/books/${id}/activate`,
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
                prevlist.map(b=>b.id===id? {...b, is_active:true} : b)
            )
            
        }catch(err){
            console.log(err)
            toast.error('Book is still deactive')
        }
    }

    async function  handlesearch(searchTerm){

        try{

            const response=await authFetch(`http://localhost:3000/api/books/search?book_name=${searchTerm}`)
            const data=await response.json()

            if(!response.ok){
                toast.error('Error while fetching book for search')
                return
            }
            setBookList(data)

        }catch(err){
            console.log(err)
            toast.error('Something went wrong, try again')
        }
    }

    useEffect(() => {
        handleviewbook()
        
    }, [])

    function handleupdate(id){
        setSelectedBookId(id)
        setShowUpdateBook(true)
    }
    function handleActivateClick(id){
        setSelectedBookId(id)
        setShowActivateConfirm(true)
    }
    function handleDeactivateClick(id){
        setSelectedBookId(id)
        setShowDeactivateConfirm(true)
    }

    return(
        <div className="dash-container">
            <AdminSidebar/>
            <Header 
                showBranding={false}
                title="BOOKS"
                icon="📚"
                showSearch={true}
                createtitle="Create Book"
                searchPlaceholder="Search Books"
                onSearch={handlesearch}
                onCreate={() => setShowCreateBook(true)}
            />                      
                    
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
                                    <button className="btn" onClick={() => book.is_active? handleDeactivateClick(book.id):handleActivateClick(book.id)}>
                                        {book.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>  
            {showCreateBook && (<CreateBook authFetch={authFetch} onClose={()=>setShowCreateBook(false)} onCreated={handleviewbook}/>)}
            {showUpdateBook && (<Updatebook authFetch={authFetch} bookId={selectedBookId} onClose={()=>setShowUpdateBook(false)} onCreated={handleviewbook}/>)}
            {showActivateConfirm && (<ConfirmActivate onConfirm={async () => {await activate(selectedBookId) 
                setShowActivateConfirm(false)}} onClose={() => setShowActivateConfirm(false)}/>)}
            {showDeativateConfirm && (<ConfirmDeactivate onConfirm={async () => {await deactivate(selectedBookId) 
                setShowDeactivateConfirm(false)}} onClose={() => setShowDeactivateConfirm(false)}/>)}    
       </div>
    )
}

export default withAuthFetch(ViewBook)