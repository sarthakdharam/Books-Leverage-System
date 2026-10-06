import { useState } from "react"
import { toast } from "react-toastify"
import withAuthFetch from "../../HOC/withAuthFetch"

function BorrowBook({ authFetch, onClose, onCreated }) {

    const [form, setForm] = useState({
        user_id: '',
        book_id: ''
    })
    const [userSearch,setUserSearch]=useState('')
    const [userSuggestions, setUserSuggestions] = useState([])

    const [bookSearch, setBookSearch] = useState('')
    const [bookSuggestions, setBookSuggestions] = useState([])

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState({})

    async function searchUsers(value) {

        setUserSearch(value)

        setForm(prev => ({
            ...prev,
            user_id: ''
        }))

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


    function selectUser(user) {

        setUserSearch(user.name)

        setForm(prev => ({
            ...prev,
            user_id: user.id
        }))

        setUserSuggestions([])

        setError(prev => ({
            ...prev,
            user_id: ''
        }))
    }

    async function searchBooks(value) {

        setBookSearch(value)

        setForm(prev => ({
            ...prev,
            book_id: ''
        }))

        setError(prev => ({
            ...prev,
            book_id: ''
        }))

        if (!value.trim()) {
            setBookSuggestions([])
            return
        }

        try {

            const response = await authFetch(
                `http://localhost:3000/api/books/search?book_name=${value}`
            )

            const data = await response.json()

            if (!response.ok) {
                setBookSuggestions([])
                return
            }

            setBookSuggestions(data)

        } catch (err) {

            console.log(err)
            setBookSuggestions([])

        }
    }


    function selectBook(book) {

        setBookSearch(book.book_name)

        setForm(prev => ({
            ...prev,
            book_id: book.id
        }))

        setBookSuggestions([])

        setError(prev => ({
            ...prev,
            book_id: ''
        }))
    }


    async function handleborrow(event) {

        event.preventDefault()

        if (isSubmitting) return

        const newError = {}

        if (!form.user_id) {
            newError.user_id = 'Select a User'
        }

        if (!form.book_id) {
            newError.book_id = 'Select a Book'
        }

        if (Object.keys(newError).length > 0) {
            setError(newError)
            return
        }

        setIsSubmitting(true)

        try {

            const response = await authFetch(`http://localhost:3000/api/borrow`,
                {
                    method: 'POST',
                    body: JSON.stringify(form)
                }
            )

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.message || 'Something went wrong while borrowing')
                return
            }

            toast.success(data.message || 'Book borrowed successfully')

            setForm({
                user_id: '',
                book_id: ''
            })

            setUserSearch('')
            setUserSuggestions([])
            setBookSearch('')
            setBookSuggestions([])
            setError({})

            onCreated()
            onClose()

        } catch (err) {

            console.log(err)
            toast.error('Something went wrong, try again')

        } finally {

            setIsSubmitting(false)

        }
    }


    return (
        <div className="modal-overlay" onClick={onClose}>

            <div className="page-container modal-form" onClick={(e) => e.stopPropagation()}>
                <div className="form-header"><h3>Borrow Book</h3>
                <button type="button" className="close-btn1" onClick={onClose} title="close">×</button>
            </div>


                <form onSubmit={handleborrow}>
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
                    <input className={`form-input ${error.book_id ? 'input-error' : ''}`} value={bookSearch} onChange={(e) => searchBooks(e.target.value)} placeholder="Search Book Name" autoComplete="off"/>
                    {bookSuggestions.length > 0 && (
                        <div className="book-suggestions">
                                {bookSuggestions.map(book => (
                                    <div key={book.id} className="book-suggestion" onClick={() => selectBook(book)}>
                                        <div className="book-name">{book.book_name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {error.book_id && (<p className="field-error">{error.book_id}</p>)}
                    <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ? <span className="loader">Submitting...</span>: 'Submit'}</button>
                </form>
            </div>
        </div>
    )
}

export default withAuthFetch(BorrowBook)