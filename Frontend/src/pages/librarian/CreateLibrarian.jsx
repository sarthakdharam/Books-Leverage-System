import { useState } from "react"
import withAuthFetch from "../../HOC/withAuthFetch"
import { toast } from "react-toastify"


function CreateLibrarian({authFetch,onCreated,onClose}){

    const [form,setForm]=useState({
        name:'',
        email:'',
        phone:'',
        username:'',
        password:'',
        branch:''
    })
    const [isSubmitting,setIsSubmitting]=useState(false)    
    const [error,setError]=useState({})


    async function handleCreate(event){
        event.preventDefault()

        if(isSubmitting)return

        const newError={}

        if(form.name.trim()===''){
            newError.name='Enter FullName'
        }

        if(form.email.trim()===''){
            newError.email='Enter Email'
        }else{
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/                                

            if (!emailPattern.test(form.email.trim())) {
                newError.email='Enter Valid Email'
            }
        }
        

        if(form.phone.trim()===''){
            newError.phone='Enter Phone Number'
        }else if (form.phone.trim().length !== 10) {
            newError.phone='Phone number should be of 10 digit'
        }
        
        if(form.username.trim()===''){
            newError.username='Enter Username'
        }
        

        if(form.password.trim()===''){
            newError.password='Enter Password'
        }
        

        if(form.branch.trim()===''){
            newError.branch='Enter Branch'
        }

        if(Object.keys(newError).length>0){
            setError(newError)
            return
        }
        setIsSubmitting(true)

        try{


            const response=await authFetch('http://localhost:3000/api/librarian',
                {
                    method:'POST',
                    body:JSON.stringify(form)
                }
            )

            const data=await response.json()

            if(!response.ok){
                toast.error(data.message || 'something failed')
                return
            }
            toast.success('Librarian Successfully Created')
            setForm({
                name:'',
                email:'',
                phone:'',
                username:'',
                password:'',
                branch:''
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
                <div className="form-header"><h3>Create Librarian</h3> 
                <button type="button" className="close-btn" onClick={onClose} title="close">×</button>
            </div>  
                <form onSubmit={handleCreate}>
                    <h4>Librarian Name<span className="required">*</span></h4>    
                    <input className={`form-input ${error.name ? 'input-error' : ''}`} name="name" value={form.name} onChange={handlechange} placeholder="Librarian Name"/>
                    {error.name && (<p className="field-error">{error.name}</p>)}
                    <h4>Librarian email<span className="required">*</span></h4>    
                    <input className={`form-input ${error.email ? 'input-error' : ''}`} name="email" value={form.email} onChange={handlechange} placeholder="email"/>
                    {error.email && (<p className="field-error">{error.email}</p>)}
                    <h4>Librarian phone No.<span className="required">*</span></h4>    
                    <input className={`form-input ${error.phone ? 'input-error' : ''}`} name="phone" value={form.phone} onChange={handlechange} placeholder="Phone No."/>
                    {error.phone && (<p className="field-error">{error.phone}</p>)}
                    <h4>Librarian Username<span className="required">*</span></h4>    
                    <input className={`form-input ${error.username ? 'input-error' : ''}`} name="username" value={form.username} onChange={handlechange} placeholder="Librarian Username"/>
                    {error.username && (<p className="field-error">{error.username}</p>)}
                    <h4>Librarian Password<span className="required">*</span></h4>    
                    <input className={`form-input ${error.password ? 'input-error' : ''}`} name="password" value={form.password} type="password" onChange={handlechange} placeholder="Password"/>
                    {error.password && (<p className="field-error">{error.password}</p>)}
                    <h4>Librarian Branch<span className="required">*</span></h4>    
                    <input className={`form-input ${error.branch ? 'input-error' : ''}`} name="branch" value={form.branch} onChange={handlechange} placeholder="Branch"/>
                    {error.branch && (<p className="field-error">{error.branch}</p>)}
                    <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting?(<span className="loader">Submitting...</span>):('Submit')}</button>
                </form>  
            </div>
        </div>
    )
}
export default withAuthFetch(CreateLibrarian)