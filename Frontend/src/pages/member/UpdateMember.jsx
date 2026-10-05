import { useState } from "react"
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch"


function UpdateMember({authFetch,onClose,onCreated}){

    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [phone,setPhone]=useState('')
    const [password,setPassword]=useState('')
    



    async function handleupdate(event){
        event.preventDefault()
        
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/

        if(email.trim() !== '' && !emailPattern.test(email.trim())){
            toast.error('Enter a valid email address')
            return
        }

        if(phone.trim() !== '' && phone.trim().length !== 10){
            toast.error('Phone number should be 10 digits')
            return
        }

        try{

            const response=await authFetch('http://localhost:3000/api/users/myaccount',{
                method:'PATCH',
                body:JSON.stringify({name,email,phone,password})
            })
            const data=await response.json()

            if(!response.ok){
                toast.error('Error while fetching')
                return
            }

            toast.success(data.message || 'Upadted Successfully')
            setName('')
            setEmail('')
            setPhone('')
            setPassword('')

            onCreated()
            onClose()


        }catch(err){
            console.log(err)
            toast.error('Something went wrong, try agian')
        }

    }

    

    return(
        <div className="modal-overlay1" onClick={onClose}>                    
                    
            <div className="page-container modal-form1" onClick={(e) => e.stopPropagation()}>     
                <div className="form-header"><h3>Update Info</h3> 
                <button type="button" className="close-btn1" onClick={onClose} title="close">×</button>
            </div>
                <form onSubmit={handleupdate}>
                    <h3>Name</h3>
                    <input className="form-input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter Updating name"/>
                    <h3>Email</h3>
                    <input className="form-input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Updating email"/>
                    <h3>Phone No.</h3>
                    <input className="form-input" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Enter Updating phone"/>
                    <h3>Password</h3>
                    <input className="form-input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Update password"/>
                    <br/>
                    <button className="btn">Submit</button>
                    <br/>
                </form>
            </div>
        </div>
    )


}
export default withAuthFetch(UpdateMember)