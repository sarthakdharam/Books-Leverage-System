import { useState } from "react"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header"
import { toast } from "react-toastify"
import AdminSidebar from "../../components/Adminsidebar"


function CreateLibrarian({authFetch}){

    const [form,setForm]=useState({
        name:'',
        email:'',
        phone:'',
        username:'',
        password:'',
        branch:''
    })
    
    const [error,setError]=useState({})


    async function handleCreate(event){
        event.preventDefault()

        const newError={}
        let errormessage=''

        if(form.name.trim()===''){
            newError.name=true
            if(!errormessage){
                errormessage='Enter FullName'
            }
        }

        if(form.email.trim()===''){
            newError.email=true
            if(!errormessage){
                errormessage='Enter Email'
            }
        }else{
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/                                

            if (!emailPattern.test(form.email.trim())) {
                newError.email=true
                if(!errormessage){
                errormessage='Enter Valid Email'
            }
            }
        }
        

        if(form.phone.trim()===''){
            newError.phone=true
            if(!errormessage){
                errormessage='Enter Phone Number'
            }
        }else if (form.phone.trim().length !== 10) {
            newError.phone=true
            if(!errormessage){
                errormessage='Phone number should be of 10 digit'
            }
        }
        
        if(form.username.trim()===''){
            newError.username=true
            if(!errormessage){
                errormessage='Enter Username'
            }
        }
        

        if(form.password.trim()===''){
            newError.password=true
            if(!errormessage){
                errormessage='Enter Password'
            }
        }
        

        if(form.branch.trim()===''){
            newError.branch=true
            if(!errormessage){
                errormessage='Enter Branch'
            }
        }

        if(Object.keys(newError).length>0){
            setError(newError)
            toast.error(errormessage)
            return
        }

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
                <h3>Create Librarian</h3>   
                <form onSubmit={handleCreate}>
                    <h4>Librarian Name<span className="required">*</span></h4>    
                    <input className={`form-input ${error.name ? 'input-error' : ''}`} name="name" value={form.name} onChange={handlechange} placeholder="Librarian Name"/>
                    <h4>Librarian email<span className="required">*</span></h4>    
                    <input className={`form-input ${error.email ? 'input-error' : ''}`} name="email" value={form.email} onChange={handlechange} placeholder="email"/>
                    <h4>Librarian phone No.<span className="required">*</span></h4>    
                    <input className={`form-input ${error.phone ? 'input-error' : ''}`} name="phone" value={form.phone} onChange={handlechange} placeholder="Phone No."/>
                    <h4>Librarian Username<span className="required">*</span></h4>    
                    <input className={`form-input ${error.username ? 'input-error' : ''}`} name="username" value={form.username} onChange={handlechange} placeholder="Librarian Username"/>
                    <h4>Librarian Password<span className="required">*</span></h4>    
                    <input className={`form-input ${error.password ? 'input-error' : ''}`} name="password" value={form.password} type="password" onChange={handlechange} placeholder="Password"/>
                    <h4>Librarian Branch<span className="required">*</span></h4>    
                    <input className={`form-input ${error.branch ? 'input-error' : ''}`} name="branch" value={form.branch} onChange={handlechange} placeholder="Branch"/>
                    
                    <br/>
                    <button className="btn">Submit</button>
                </form>  
            </div>
        </div>
    )
}
export default withAuthFetch(CreateLibrarian)