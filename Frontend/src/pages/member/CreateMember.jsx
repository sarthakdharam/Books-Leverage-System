import { useState } from "react"
import { useNavigate } from "react-router-dom"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header";
import LibrarianSidebar from "../../components/Librariansidebar";

function Createuser({authFetch}){

    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [phone,setPhone]=useState('')
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [error,setError]=useState('')
    const [success,setSuccess]=useState('')
    const navigate=useNavigate()

    function handlenavigate(){
        return navigate('/librarian/dashboard')
    }

    async function handleCreate(event){
        event.preventDefault()
        setError('')
        if(name.trim()===''){
            setError('Enter name of user')
            return
        }

        if(email.trim()===''){
            setError('Enter email of user')
            return
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/

        if(!emailPattern.test(email.trim())){
            setError('Enter a valid email address')
            return
        }

        if(phone.trim()===''){
            setError('Enter phone number of user')
            return
        }
        if(phone.trim().length!==10){
            setError('Phone number should be of 10 digit')
            return
        }

        if(username.trim()===''){
            setError('Enter username of user')
            return
        }
        

        if(password.trim()===''){
            setError('Enter password for user')
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
                setError(data.message || 'something failed')
                return
            }
            setSuccess('User Successfully Created')
            setName('')
            setEmail('')
            setPhone('')
            setUsername('')
            setPassword('')

        }catch(err){
            console.log(err)
            setError('somethiong went wrong,try Again')
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
                    <input className="form-input" value={name} onChange={(e)=>{setName(e.target.value),setError('')}} placeholder="User Name"/>
                    <h4>User email:</h4>    
                    <input className="form-input" value={email} onChange={(e)=>{setEmail(e.target.value),setError('')}} placeholder="email"/>
                    <h4>User phone No.:</h4>    
                    <input className="form-input" value={phone} onChange={(e)=>{setPhone(e.target.value),setError('')}} placeholder="Phone No."/>
                    <h4>User Username:</h4>    
                    <input className="form-input" value={username} onChange={(e)=>{setUsername(e.target.value),setError('')}} placeholder="Users Username"/>
                    <h4>User Password:</h4>    
                    <input className="form-input" value={password} type="password" onChange={(e)=>{setPassword(e.target.value),setError('')}} placeholder="Password"/>
                    <br/>
                    <br/>
                    <button className="btn">Submit</button>
                </form>  
                <br/>
            {error && <p style={{color:'red'}}>{error}</p>}
            {success && <p style={{color:'green'}}>{success}</p>}
            </div>
        </div>
    )
}

export default withAuthFetch(Createuser)