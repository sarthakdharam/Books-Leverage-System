import { useState } from "react"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header"
import { toast } from "react-toastify"
import AdminSidebar from "../../components/Adminsidebar"


function CreateLibrarian({authFetch}){
    
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [phone,setPhone]=useState('')
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [branch,setBranch]=useState('')


    async function handleCreate(event){
        event.preventDefault()
        if(name.trim()===''){
            toast.error('Enter name of librarian')
            return
        }

        if(email.trim()===''){
            toast.error('Enter email of librarian')
            return
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/

        if(!emailPattern.test(email.trim())){
            toast.error('Enter a valid email address')
            return
        }

        if(phone.trim()===''){
            toast.error('Enter phone number of librarian')
            return
        }
        if(phone.trim().length!==10){
            toast.error('Phone number should be of 10 digit')
            return
        }

        if(username.trim()===''){
            toast.error('Enter username of librarian')
            return
        }
        

        if(password.trim()===''){
            toast.error('Enter password for librarian')
            return
        }
        

        if(branch.trim()===''){
            toast.error('Enter name of branch')
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
                toast.error(data.message || 'something failed')
                return
            }
            toast.success('Librarian Successfully Created')
            setName('')
            setEmail('')
            setPhone('')
            setUsername('')
            setPassword('')
            setBranch('')

        }catch(err){
            console.log(err)
            toast.error('somethiong went wrong,try Again')
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
                    <input className="form-input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Librarian Name"/>
                    <h4>Librarian email:</h4>    
                    <input className="form-input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email"/>
                    <h4>Librarian phone No.:</h4>    
                    <input className="form-input" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone No."/>
                    <h4>Librarian Username:</h4>    
                    <input className="form-input" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Librarian Username"/>
                    <h4>Librarian Password:</h4>    
                    <input className="form-input" value={password} type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
                    <h4>Librarian Branch:</h4>    
                    <input className="form-input" value={branch} onChange={(e)=>setBranch(e.target.value)} placeholder="Branch"/>
                    
                    <br/>
                    <button className="btn">Submit</button>
                </form>  
            </div>
        </div>
    )
}
export default withAuthFetch(CreateLibrarian)