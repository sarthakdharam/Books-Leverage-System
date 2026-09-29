import { useState } from "react"
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header";
import LibrarianSidebar from "../../components/Librariansidebar";

function Createuser({authFetch}){

    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [phone,setPhone]=useState('')
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')


    async function handleCreate(event){
        event.preventDefault()
        if(name.trim()===''){
            toast.error('Enter name of user')
            return
        }

        if(email.trim()===''){
            toast.error('Enter email of user')
            return
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/

        if(!emailPattern.test(email.trim())){
            toast.error('Enter a valid email address')
            return
        }

        if(phone.trim()===''){
            toast.error('Enter phone number of user')
            return
        }
        if(phone.trim().length!==10){
            toast.error('Phone number should be of 10 digit')
            return
        }

        if(username.trim()===''){
            toast.error('Enter username of user')
            return
        }
        

        if(password.trim()===''){
            toast.error('Enter password for user')
            return
        }
        

        try{


            const response=await authFetch('http://localhost:3000/api/users',
                {
                    method:'POST',
                    body:JSON.stringify({name,email,phone,username,password})
                }
            )

            const data=await response.json()

            if(!response.ok){
                toast.error(data.message || 'something failed')
                return
            }
            toast.success('User Successfully Created')
            setName('')
            setEmail('')
            setPhone('')
            setUsername('')
            setPassword('')

        }catch(err){
            console.log(err)
            toast.error('somethiong went wrong,try Again')
        }
    }

    return(
        <div className="dash-container">
            <LibrarianSidebar/>
            
            <Header/>                      
                    
            <div className="page-container">        
                <h3>Create User</h3>   
                <form onSubmit={handleCreate}>
                    <h4>User Name:</h4>    
                    <input className="form-input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="User Name"/>
                    <h4>User email:</h4>    
                    <input className="form-input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email"/>
                    <h4>User phone No.:</h4>    
                    <input className="form-input" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone No."/>
                    <h4>User Username:</h4>    
                    <input className="form-input" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Users Username"/>
                    <h4>User Password:</h4>    
                    <input className="form-input" value={password} type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
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