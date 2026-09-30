import { useState } from "react"
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header";
import LibrarianSidebar from "../../components/Librariansidebar";

function Createuser({authFetch}){

    const [form,setForm]=useState({
        name:'',
        email:'',
        phone:'',
        username:'',
        password:''
    })

    // const [name,setName]=useState('')
    // const [email,setEmail]=useState('')
    // const [phone,setPhone]=useState('')
    // const [username,setUsername]=useState('')
    // const [password,setPassword]=useState('')
    const [error,setError]=useState({})


    async function handleCreate(event){
        event.preventDefault()

        const newError={}
        let errormessage=''

        if(form.name.trim()===''){
            newError.name=true

            if(!errormessage){
                errormessage='Enter Fullname '
            }
        }

        if(form.email.trim()===''){
            newError.email=true
            if(!errormessage){
               errormessage='Enter Email'
            }
            
        }else{
            
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/
    
            if(!emailPattern.test(form.email.trim())){
                newError.email=true
                if(!errormessage){
                    errormessage='Email should be valid'
                }
                
            }
        }

        if(form.phone.trim()===''){
            newError.phone=true
            if(!errormessage){
                    errormessage='Enter Phone Number '
                }
        }else if(form.phone.trim().length!==10){
            newError.phone=true
            if(!errormessage){
                    errormessage='Phone Number should be of 10 digit'
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

        if(Object.keys(newError).length>0){
            setError(newError)
            toast.error(errormessage)
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
            <LibrarianSidebar/>
            
            <Header/>                      
                    
            <div className="page-container">        
                <h3>Create User</h3>   
                <form onSubmit={handleCreate}>
                    <h4>User Name<span className="required">*</span></h4>    
                    <input className={`form-input ${error.name ? 'input-error' : ''}`} name="name" value={form.name} onChange={handlechange} placeholder="User Name"/>
                    <h4>User email<span className="required">*</span></h4>    
                    <input className={`form-input ${error.email ? 'input-error' : ''}`} name="email" value={form.email} onChange={handlechange} placeholder="email"/>
                    <h4>User phone No.<span className="required">*</span></h4>    
                    <input className={`form-input ${error.phone ? 'input-error' : ''}`} name="phone" value={form.phone} onChange={handlechange} placeholder="Phone No."/>
                    <h4>User Username<span className="required">*</span></h4>    
                    <input className={`form-input ${error.username ? 'input-error' : ''}`} name="username" value={form.username} onChange={handlechange} placeholder="Users Username"/>
                    <h4>User Password<span className="required">*</span></h4>    
                    <input className={`form-input ${error.password ? 'input-error' : ''}`} name="password" value={form.password} type="password" onChange={handlechange} placeholder="Password"/>
                    <br/>
                    <br/>
                    <button className="btn">Submit</button>
                </form>  
                <br/>
            
            </div>
        </div>
    )
}

export default withAuthFetch(Createuser)