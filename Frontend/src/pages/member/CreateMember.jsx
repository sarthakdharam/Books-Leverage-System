import { useState } from "react"
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch"

function Createuser({authFetch,onClose,onCreated}){

    const [form,setForm]=useState({
        name:'',
        email:'',
        phone:'',
        username:'',
        password:''
    })
    

    const [error,setError]=useState({})


    async function handleCreate(event){
        event.preventDefault()

        const newError={}

        if(form.name.trim()===''){
            newError.name='Enter Fullname'
        }

        if(form.email.trim()===''){
            newError.email='Enter Email'
            
        }else{
            
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/
    
            if(!emailPattern.test(form.email.trim())){
                newError.email='Email should be valid'                
            }
        }

        if(form.phone.trim()===''){
            newError.phone='Enter Phone Number'

        }else if(form.phone.trim().length!==10){
            newError.phone='Phone Number should be of 10 digit'
        }

        if(form.username.trim()===''){
            newError.username='Enter Username'
        }
        

        if(form.password.trim()===''){
            newError.password='Enter Password'
        }

        if(Object.keys(newError).length>0){
            setError(newError)
            return
        }
        

        try{


            const response=await authFetch('http://localhost:3000/api/users',
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
            toast.success('User Successfully Created')
            setForm({
                name:'',
                email:'',
                phone:'',
                username:'',
                password:''
            })

            setError({})
            onCreated()
            onClose()

        }catch(err){
            console.log(err)
            toast.error('somethiong went wrong,try Again')
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
                <div className="form-header"><h3>Create User</h3> 
                <button type="button" className="close-btn" onClick={onClose} title="close">×</button>
            </div>   
                
                <form onSubmit={handleCreate}>
                    <h4>User Name<span className="required">*</span></h4>    
                    <input className={`form-input ${error.name ? 'input-error' : ''}`} name="name" value={form.name} onChange={handlechange} placeholder="User Name"/>
                    {error.name && (<p className="field-error">{error.name}</p>)}
                    <h4>User email<span className="required">*</span></h4>    
                    <input className={`form-input ${error.email ? 'input-error' : ''}`} name="email" value={form.email} onChange={handlechange} placeholder="email"/>
                    {error.email && (<p className="field-error">{error.email}</p>)}
                    <h4>User phone No.<span className="required">*</span></h4>    
                    <input className={`form-input ${error.phone ? 'input-error' : ''}`} name="phone" value={form.phone} onChange={handlechange} placeholder="Phone No."/>
                    {error.phone && (<p className="field-error">{error.phone}</p>)}
                    <h4>User Username<span className="required">*</span></h4>    
                    <input className={`form-input ${error.username ? 'input-error' : ''}`} name="username" value={form.username} onChange={handlechange} placeholder="Users Username"/>
                    {error.username && (<p className="field-error">{error.username}</p>)}
                    <h4>User Password<span className="required">*</span></h4>    
                    <input className={`form-input ${error.password ? 'input-error' : ''}`} name="password" value={form.password} type="password" onChange={handlechange} placeholder="Password"/>
                    {error.password && (<p className="field-error">{error.password}</p>)}
                    <button className="btn">Submit</button>
                </form>  
                <br/>
            
            </div>
        </div>
    )
}

export default withAuthFetch(Createuser)