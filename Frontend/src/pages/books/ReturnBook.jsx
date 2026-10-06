import { useState } from "react"
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch"



function ReturnBook({authFetch,onClose,onCreated}){

    const [form,setForm]=useState({
        user_id:'',
        book_id:''
    })
    const [bookSearch, setBookSearch] = useState('')
    const [bookSuggestions, setBookSuggestions] = useState([])
    const[error,setError]=useState({})
    const [isSubmitting,setIsSubmitting]=useState(false)

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

    async function handlereturn(event){
        event.preventDefault()

        if(isSubmitting) return
          
        const newError={}

         if(Number(form.user_id)<=0){
            newError.user_id='Enter Correct User Id'
        }
        if(Number(form.book_id)<=0){
            newError.book_id='Enter Correct Book Id'
        }

        if(Object.keys(newError).length>0){
            setError(newError)
            return
        }

        setIsSubmitting(true)

        try{
            const response=await authFetch(`http://localhost:3000/api/borrow/return`,{
                method:'PATCH',
                body:JSON.stringify(form)
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

    function handlechange(e){
        const {name , value}=e.target

        setForm(prev=>({...prev,[name]:value}))
        setError(prev=>({...prev,[name]:''}))
    }

    return(
        <div className="modal-overlay" onClick={onClose}>                   
                    
            <div className="page-container modal-form" onClick={(e) => e.stopPropagation()}>     
                <div className="form-header"><h3>Return Book</h3> 
                <button type="button" className="close-btn1" onClick={onClose} title="close">×</button>
            </div>
                <form onSubmit={handlereturn}>
                    
                    <input className={`form-input ${error.user_id ? 'input-error' : ''}`} name="user_id" value={form.user_id} onChange={handlechange} placeholder="User Id"/>
                    {error.user_id && (<p className="field-error">{error.user_id}</p>)}
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
                    <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ? (<span className="loader">Submitting</span>):('Submit')}</button>
                </form>
            </div>
        </div>
    )
}

export default withAuthFetch(ReturnBook)