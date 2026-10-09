
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import withAuthFetch from "../../HOC/withAuthFetch"
import BookPage from "./BookPage"

function SearchBook({authFetch}){

    const [search,setSearch]=useState([])
    const [query,setQuery]=useState('')
    const [showBookPage, setShowBookPage] = useState(false)
    const [selectedBookId, setSelectedBookId] = useState(null)

    async function  handlesearch(searchTerm){

        try{

            const response=await authFetch(`http://localhost:3000/api/books/search?book_name=${searchTerm}`)
            const data=await response.json()

            if(!response.ok){
                toast.error('Error while fetching book for search')
                return
            }
            setSearch(data)

        }catch(err){
            console.log(err)
            toast.error('Something went wrong, try again')
        }
    }

    
    useEffect(()=>{
        handlesearch(query)
    },[query])

    function handleBookClick(id) {
    setSelectedBookId(id)
    setShowBookPage(true)
}
    return(
        <div>
            <input className="search-input" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search for Books"/>
                <div className="book-grid">
                    {search.map(book => (
                        <div className="book-card" key={book.id} onClick={() =>handleBookClick(book.id)}>
                            <img
                                src={book.book_image || 'https://via.placeholder.com/160x220?text=No+Cover'}
                                alt={book.book_name}
                                className="book-cover"
                            />
                            <h4 className="book-title">{book.book_name}</h4>
                            <p className="book-author">{book.book_author}</p>
                            <span className="book-category">{book.category}</span>
                        </div>
                    ))}
                </div>    
                {showBookPage && (<BookPage authFetch={authFetch} id={selectedBookId} onClose={() => setShowBookPage(false)}/>
)}              </div>
    )
}
export default withAuthFetch(SearchBook)