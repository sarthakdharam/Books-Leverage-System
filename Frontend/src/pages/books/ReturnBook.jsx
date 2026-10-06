import { useState } from "react"
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch"



function ReturnBook({authFetch,onClose,onCreated}){

    const [form,setForm]=useState({
        user_id:''
    })

    const [userSearch,setUserSearch]=useState('')
    const [userSuggestions, setUserSuggestions] = useState([])
    const [borrowedBooks, setBorrowedBooks] = useState([])
    const [selectedBookIds, setSelectedBookIds] = useState([])
    const [error,setError]=useState({})
    const [isSubmitting,setIsSubmitting]=useState(false)

    async function searchUsers(value) {

        setUserSearch(value)

        setForm(prev => ({
            ...prev,
            user_id: ''
        }))

        setBorrowedBooks([])
        setSelectedBookIds([])

        setError(prev => ({
            ...prev,
            user_id: ''
        }))

        if (!value.trim()) {
            setUserSuggestions([])
            return
        }

        try {

            const response = await authFetch(
                `http://localhost:3000/api/users/search?name=${value}`
            )

            const data = await response.json()

            if (!response.ok) {
                setUserSuggestions([])
                return
            }

            setUserSuggestions(data)

        }catch(err) {

            console.log(err)
            setUserSuggestions([])

        }
    }


     async function selectUser(user) {

        setUserSearch(user.name)

        setForm(prev => ({
            ...prev,
            user_id: user.id
        }))

        setUserSuggestions([])
        setSelectedBookIds([])

        setError(prev => ({
            ...prev,
            user_id: ''
        }))
        await loadBorrowedBooks(user.id)
    }

    async function loadBorrowedBooks(userId) {

        try {
            const response = await authFetch(`http://localhost:3000/api/borrow/logs`)
            const data = await response.json()
            
            if (!response.ok) {
                setBorrowedBooks([])
                return
            }

            const books = data.filter(record =>record.user.id === Number(userId) && record.status === 'borrowed')
            setBorrowedBooks(books)
        } catch(err) {
            console.log(err)
            setBorrowedBooks([])
        }
    }


    function handleBookCheckbox(bookId) {
        setSelectedBookIds(prev => {
            if (prev.includes(bookId)) {
                return prev.filter(id => id !== bookId)
            }
            return [...prev, bookId]
        })
        setError(prev => ({
            ...prev,
            book_id: ''
        }))
    }

    async function handlereturn(event){
        event.preventDefault()

        if(isSubmitting) return
          
        const newError={}

        if (!form.user_id) {
            newError.user_id = 'Select a User'
        }

        if (borrowedBooks.length > 0 && selectedBookIds.length === 0) {
            newError.book_id = 'Select at least one book'
        }

        if(Object.keys(newError).length>0){
            setError(newError)
            return
        }

        setIsSubmitting(true)

        try{
            const response=await authFetch(`http://localhost:3000/api/borrow/return`,{
                method:'PATCH',
                body:JSON.stringify({user_id:form.user_id,book_ids: selectedBookIds})
            })

            const data=await response.json()

            if(!response.ok){
                toast.error('Something went wrong while fetching')
                return
            }

            toast.success(data.message || 'book returned successfully')
            setForm({
                user_id:'',
                book_id:''
            })
            setError({})
            onCreated()
            onClose()


        }catch(err){
            console.log(err)
            toast.error('Something went wrong ,try again')
        }finally{
            setIsSubmitting(false)
        }
    }

    return(
        <div className="modal-overlay" onClick={onClose}>                   
                    
            <div className="page-container modal-form" onClick={(e) => e.stopPropagation()}>     
                <div className="form-header"><h3>Return Book</h3> 
                <button type="button" className="close-btn1" onClick={onClose} title="close">×</button>
            </div>
                <form onSubmit={handlereturn}>
                    <div className="book-search-container">
                    <input className={`form-input ${error.user_id ? 'input-error' : ''}`} value={userSearch} onChange={(e)=>searchUsers(e.target.value)} placeholder="Search User Name" autoComplete="off"/>
                    {userSuggestions.length > 0 && (
                        <div className="book-suggestions">
                            {userSuggestions.map(user=>(
                                <div key={user.id} className="book-suggestion" onClick={()=>selectUser(user)}>
                                    <div className="book-name">{user.name}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {error.user_id && (<p className="field-error">{error.user_id}</p>)}
                    </div>
                    <div className="book-search-container">
                        {form.user_id && borrowedBooks.length > 0 && (
                        <div className="borrowed-books">
                            <h3>Borrowed Books</h3>
                            {borrowedBooks.map(record => (
                                <label key={record.id} className="borrowed-book-item">
                                    <input type="checkbox" checked={selectedBookIds.includes(record.book.id)} onChange={() => handleBookCheckbox(record.book.id)}/>
                                    <span>{record.book.book_name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                    {form.user_id && borrowedBooks.length === 0 && (
                        <p className="no-borrowed-books">This user has no currently borrowed books.</p>
                    )}
                    </div>
                    {error.book_id && (<p className="field-error">{error.book_id}</p>)}
                    <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ? (<span className="loader">Submitting</span>):('Submit')}</button>
                </form>
            </div>
        </div>
    )
}

export default withAuthFetch(ReturnBook)