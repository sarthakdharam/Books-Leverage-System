import { useState } from "react"
import { useNavigate } from "react-router-dom"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header"
import AdminSidebar from "../../components/Adminsidebar"


function CreateLibrarian({authFetch}){
    
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [phone,setPhone]=useState('')
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [branch,setBranch]=useState('')
    const [error,setError]=useState('')
    const [success,setSuccess]=useState('')
    const navigate=useNavigate()

    function handlenavigate(){
        return navigate('/admin/dashboard')
    }

    async function handleCreate(event){
        event.preventDefault()
        setError('')
        if(name.trim()===''){
            setError('Enter name of librarian')
            return
        }

        if(email.trim()===''){
            setError('Enter email of librarian')
            return
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/

        if(!emailPattern.test(email.trim())){
            setError('Enter a valid email address')
            return
        }

        if(phone.trim()===''){
            setError('Enter phone number of librarian')
            return
        }
        if(phone.trim().length!==10){
            setError('Phone number should be of 10 digit')
            return
        }

        if(username.trim()===''){
            setError('Enter username of librarian')
            return
        }
        

        if(password.trim()===''){
            setError('Enter password for librarian')
            return
        }
        

        if(branch.trim()===''){
            setError('Enter name of branch')
            return
        }

        try{


            const response=await authFetch('http://localhost:3000/api/librarian',
                {
                    method:'POST',
                    body:JSON.stringify({name,email,phone,username,password,branch})
                }
            )

            const data=await response.json()

            if(!response.ok){
                setError(data.message || 'something failed')
                setName('')
                setEmail('')
                setPhone('')
                setUsername('')
                setPassword('')
                setBranch('')

                return
            }
            setSuccess('Librarian Successfully Created')
            setName('')
            setEmail('')
            setPhone('')
            setUsername('')
            setPassword('')
            setBranch('')

        }catch(err){
            console.log(err)
            setError('somethiong went wrong,try Again')
        }
    }

    return(
        <div className="dash-container">
            <AdminSidebar/>
            <Header/>                      
                    
            <div className="page-container">
                <h3>Create Librarian</h3>   
                <form onSubmit={handleCreate}>
                    <h4>Librarian Name:</h4>    
                    <input className="form-input" value={name} onChange={(e)=>{setName(e.target.value),setError('')}} placeholder="Librarian Name"/>
                    <h4>Librarian email:</h4>    
                    <input className="form-input" value={email} onChange={(e)=>{setEmail(e.target.value),setError('')}} placeholder="email"/>
                    <h4>Librarian phone No.:</h4>    
                    <input className="form-input" value={phone} onChange={(e)=>{setPhone(e.target.value),setError('')}} placeholder="Phone No."/>
                    <h4>Librarian Username:</h4>    
                    <input className="form-input" value={username} onChange={(e)=>{setUsername(e.target.value),setError('')}} placeholder="Librarian Username"/>
                    <h4>Librarian Password:</h4>    
                    <input className="form-input" value={password} type="password" onChange={(e)=>{setPassword(e.target.value),setError('')}} placeholder="Password"/>
                    <h4>Librarian Branch:</h4>    
                    <input className="form-input" value={branch} onChange={(e)=>{setBranch(e.target.value),setError('')}} placeholder="Branch"/>
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
export default withAuthFetch(CreateLibrarian)