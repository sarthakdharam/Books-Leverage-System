import { useState } from "react"
import { toast } from "react-toastify"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header"
import AdminSidebar from "../../components/Adminsidebar"


function CreateBook({authFetch}){

    const [form,setForm]=useState({
        book_name:'',
        book_author:'',
        total_books:0,
        category:'',
        book_image:''
    })

    const [error,setError]=useState({})


    async function handlecreatebook(event){
        event.preventDefault()

        const newError={}
        let errormassage=''

        if(form.book_name.trim()===''){
            newError.book_name=true
            if(!errormassage){
                errormassage='Enter Book Name'
            }
        }

        if(form.book_author.trim()===''){
            newError.book_author=true
            if(!errormassage){
                errormassage='Enter Name of Book Author'
            }
        }

        if(Number(form.total_books)<=0){
            newError.total_books=true
            if(!errormassage){
                errormassage='Quantity of Book Should Be Atleast 1'
            }
        }

        if(form.category.trim()===''){
            newError.category=true
            if(!errormassage){
                errormassage='Enter The Category of Book'
            }
        }

        if(form.book_image.trim()===''){
            newError.book_image=true
            if(!errormassage){
                errormassage='Enter The Url of Book Cover Page'
            }
        }

        if(Object.keys(newError).length>0){
            setError(newError)
            toast.error(errormassage)
            return
        }


        
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
            
        }catch(err){
            console.log(err)
            toast.error('somethiong went wrong,try Again')
        }
    }

    function handlechange(e){
        const {name , value}=e.target

        setForm(prev=>({...prev,[name]:value}))
        setError(prev=>({...prev,[name]:false}))
    }
    return(
        <div className="dash-container">
            <AdminSidebar/>
            <Header/>                      
                    
            <div className="page-container">
                <form onSubmit={handlecreatebook}>
                    <h3>BOOK NAME<span className="required">*</span></h3>
                    <input className={`form-input ${error.book_name ? 'input-error' : ''}`} name="book_name" value={form.book_name} onChange={handlechange} placeholder="Book Name"/>
                    <h3>BOOK AUTHOR<span className="required">*</span></h3>
                    <input className={`form-input ${error.book_author ? 'input-error' : ''}`} name="book_author" value={form.book_author} onChange={handlechange} placeholder="Book Author"/>
                    <h3>TOTAL BOOK<span className="required">*</span></h3>
                    <input className={`form-input ${error.total_books ? 'input-error' : ''}`} name="total_books" value={form.total_books} type="number" onChange={handlechange} placeholder="Total Books"/>
                    <h3>BOOK Category<span className="required">*</span></h3>
                    <input className={`form-input ${error.category ? 'input-error' : ''}`} name="category" value={form.category} onChange={handlechange} placeholder="Book Category"/>
                    <h3>BOOK Cover<span className="required">*</span></h3>
                    <input className={`form-input ${error.book_image ? 'input-error' : ''}`} name="book_image" value={form.book_image} onChange={handlechange} placeholder="Book Cover Link"/>
                    <br/>
                    <button className="btn">Submit</button>
                </form>
            </div>
        </div>
    )
}
export default withAuthFetch(CreateBook)