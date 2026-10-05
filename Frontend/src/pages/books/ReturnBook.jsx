import { useState } from "react"
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch"



function ReturnBook({authFetch,onClose,onCreated}){

    const [form,setForm]=useState({
        user_id:'',
        book_id:''
    })
    const[error,setError]=useState({})
    const [isSubmitting,setIsSubmitting]=useState(false)

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
                body:JSON.stringify({user_id,book_id})
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
                    <input className={`form-input ${error.book_id ? 'input-error' : ''}`} name="book_id" value={form.book_id} onChange={handlechange} placeholder="Book Id"/>
                    {error.book_id && (<p className="field-error">{error.book_id}</p>)}
                    <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ? (<span className="loader">Submitting</span>):('Submit')}</button>
                </form>
            </div>
        </div>
    )
}

export default withAuthFetch(ReturnBook)