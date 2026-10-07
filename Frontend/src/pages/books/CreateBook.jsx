import { useState } from "react"
import { toast } from "react-toastify"
import withAuthFetch from "../../HOC/withAuthFetch"


function CreateBook({authFetch,onClose,onCreated}){

    const [form,setForm]=useState({
        book_name:'',
        book_author:'',
        total_books:0,
        category:'',
        book_image:''
    })

    const [error,setError]=useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)


    async function handlecreatebook(event){
        event.preventDefault()
        if (isSubmitting) return


        const newError={}

        if(form.book_name.trim()===''){
            newError.book_name='Enter Book Name'
        }

        if(form.book_author.trim()===''){
            newError.book_author='Enter Book Author'
        }

        if(Number(form.total_books)<=0){
            newError.total_books="Quantity of Book Should Be Atleast 1"
        }

        if(form.category.trim()===''){
            newError.category="Enter Book Category"
        }

        if(form.book_image.trim()===''){
            newError.book_image="Enter Book Cover Page Url"
        }

        if(Object.keys(newError).length>0){
            setError(newError)
            return
        }


        setIsSubmitting(true)

        
        try{
            const response=await authFetch('http://localhost:3000/api/books',
                {
                    method:'POST',
                    body:JSON.stringify({...form,available_books:Number(form.total_books)})
                }
            )

            const data=await response.json()

            if(!response.ok){
                toast.error( data.message || 'something failed')
                return
            }

            toast.success(data.message || 'Book Sucessfully created')
            setForm({
                book_name:'',
                book_author:'',
                total_books:0,
                category:'',
                book_image:''
            })

            setError({})
            onCreated()
            onClose()
            
        }catch(err){
            console.log(err)
            toast.error('somethiong went wrong,try Again')
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
                <div className="form-header"><h3>Create Book</h3> 
                <button type="button" className="close-btn1" onClick={onClose} title="close">×</button>
            </div>

                <form onSubmit={handlecreatebook}>
                    <h3>BOOK NAME<span className="required">*</span></h3>
                    <input className={`form-input ${error.book_name ? 'input-error' : ''}`} name="book_name" value={form.book_name} onChange={handlechange} placeholder="Book Name"/>
                    {error.book_name && (<p className="field-error">{error.book_name}</p>)}
                    <h3>BOOK AUTHOR<span className="required">*</span></h3>
                    <input className={`form-input ${error.book_author ? 'input-error' : ''}`} name="book_author" value={form.book_author} onChange={handlechange} placeholder="Book Author"/>
                    {error.book_author && (<p className="field-error">{error.book_author}</p>)}
                    <h3>TOTAL BOOK<span className="required">*</span></h3>
                    <input className={`form-input ${error.total_books ? 'input-error' : ''}`} name="total_books" value={form.total_books} type="number" onChange={handlechange} placeholder="Total Books"/>
                    {error.total_books && (<p className="field-error">{error.total_books}</p>)}
                    <h3>BOOK Category<span className="required">*</span></h3>
                    <input className={`form-input ${error.category ? 'input-error' : ''}`} name="category" value={form.category} onChange={handlechange} placeholder="Book Category"/>
                    {error.category && (<p className="field-error">{error.category}</p>)}
                    <h3>BOOK Cover<span className="required">*</span></h3>
                    <input className={`form-input ${error.book_image ? 'input-error' : ''}`} name="book_image" value={form.book_image} onChange={handlechange} placeholder="Book Cover Link"/>
                    {error.book_image && (<p className="field-error">{error.book_image}</p>)}
                    <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ? (<span className="loader">Submitting...</span>):('Submit')}</button>
                </form>
            </div>
        </div>
    )
}
export default withAuthFetch(CreateBook)