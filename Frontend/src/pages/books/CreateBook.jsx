import { useState } from "react"
import { toast } from "react-toastify"
import withAuthFetch from "../../HOC/withAuthFetch"
import { BookCategory } from "../../constant/BookCategory"


function CreateBook({authFetch,onClose,onCreated}){

    const [form,setForm]=useState({
        book_name:'',
        book_author:'',
        total_books:0,
        category:'',
        book_image:'',
        book_description:''
    })
    const [coverFile, setCoverFile] = useState(null)
    const [coverPreview, setCoverPreview] = useState('')
    const [coverMethod, setCoverMethod] = useState('url')
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

        if(!form.category){
            newError.category="Please Select Category"
        }

        if (!form.book_image.trim() && !coverFile) {
            newError.book_image = "Enter Book Page Url or Upload Image"
        }

        if(form.book_description.trim()===''){
            newError.book_description="Enter Description For Book"
        }

        if(Object.keys(newError).length>0){
            setError(newError)
            return
        }


        setIsSubmitting(true)

        
        try{
            let bookImageUrl = form.book_image.trim()

            if (coverFile) {
                const imageFormData = new FormData()

                imageFormData.append('file', coverFile)
                imageFormData.append('upload_preset',import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
                const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: 'POST',
                        body: imageFormData
                    })

                const uploadedImage = await uploadResponse.json()

                if (!uploadResponse.ok) {
                    throw new Error(
                        uploadedImage.error?.message || 'Book cover upload failed'
                    )
                }

                bookImageUrl = uploadedImage.secure_url
            }
            const response=await authFetch('http://localhost:3000/api/books',
                {
                    method:'POST',
                    body: JSON.stringify({...form,book_image: bookImageUrl,available_books: Number(form.total_books)})
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
                book_image:'',
                book_description:''
            })
            setCoverFile(null)
            setCoverPreview('')
            setCoverMethod('url')
            setError({})
            onCreated()
            onClose()
            
        }catch(err){
            console.log(err)
            toast.error(err.message || 'somethiong went wrong,try Again')
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
                    <h3>CATEGORY<span className="required">*</span></h3>
                    <select className={`form-input ${error.category ? 'input-error' : ''}`} name="category" value={form.category} onChange={handlechange}>
                        <option value=''>Select Category</option>
                        {BookCategory.map(category=>(
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    {error.category && (<p className="field-error">{error.category}</p>)}
                    <div>
                    <h3>BOOK Cover<span className="required">*</span></h3>
                    <input className="form-input" name="book_image" value={form.book_image} onChange={(e) => {
                        handlechange(e)
                        setCoverFile(null)
                        setCoverPreview('')
                        setCoverMethod('url')}}
                        placeholder="Paste Book Cover URL"/>
                    <p>Or upload a cover image</p>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {const file = e.target.files?.[0]
                    if (!file) return
                    setCoverFile(file)
                    setCoverMethod('upload')
                    setCoverPreview(URL.createObjectURL(file))
                    setForm(prev => ({ ...prev, book_image: '' }))
                    setError(prev => ({ ...prev, book_image: '' }))}}/>
                    {coverPreview && (<img src={coverPreview} alt="Book Cover Preview" style={{ width: '80px', height: '110px', objectFit: 'cover' }}/>)}
                    </div>
                    {error.book_image && (<p className="field-error">{error.book_image}</p>)}
                    <h3>BOOK Description<span className="required">*</span></h3>
                    <input className={`form-input ${error.book_description ? 'input-error' : ''}`} name="book_description" value={form.book_description} onChange={handlechange} placeholder="Book Description"/>
                    {error.book_description && (<p className="field-error">{error.book_description}</p>)}
                    <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ? (<span className="loader">Submitting...</span>):('Submit')}</button>
                </form>
            </div>
        </div>
    )
}
export default withAuthFetch(CreateBook)