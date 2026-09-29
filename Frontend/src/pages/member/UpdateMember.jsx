import { useState } from "react"
import { useNavigate } from "react-router-dom"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header";
import MemberSidebar from "../../components/MemberSidebar";


function UpdateMember({authFetch}){

    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [phone,setPhone]=useState('')
    const [password,setPassword]=useState('')
    const [error,setError]=useState('')
    const [success,setSuccess]=useState('')
    const navigate=useNavigate()

    function handlenavigate(){
        return navigate('/user/Myaccount')
    }

    async function handleupdate(event){
        event.preventDefault()
        setError('')
        setSuccess('')
        
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/

        if(email.trim() !== '' && !emailPattern.test(email.trim())){
            setError('Enter a valid email address')
            return
        }

        if(phone.trim() !== '' && phone.trim().length !== 10){
            setError('Phone number should be 10 digits')
            return
        }

        try{

            const response=await authFetch('http://localhost:3000/api/users/myaccount',{
                method:'PATCH',
                body:JSON.stringify({name,email,phone,password})
            })
            const data=await response.json()

            if(!response.ok){
                setError('Error while fetching')
                return
            }

            setSuccess(data.message || 'Upadted Successfully')
            setName('')
            setEmail('')
            setPhone('')
            setPassword('')


        }catch(err){
            console.log(err)
            setError('Something went wrong, try agian')
        }

    }

    

    return(
        <div className="dash-container">
            <MemberSidebar/>
            <Header/>                      
                    
            <div className="page-container">
                <h3>Update Info</h3>
                <form onSubmit={handleupdate}>
                    <h3>Name</h3>
                    <input className="form-input" value={name} onChange={(e)=>{setName(e.target.value),setError('')}} placeholder="Enter Updating name"/>
                    <h3>Email</h3>
                    <input className="form-input" value={email} onChange={(e)=>{setEmail(e.target.value),setError('')}} placeholder="Enter Updating email"/>
                    <h3>Phone No.</h3>
                    <input className="form-input" value={phone} onChange={(e)=>{setPhone(e.target.value),setError('')}} placeholder="Enter Updating phone"/>
                    <h3>Password</h3>
                    <input className="form-input" value={password} onChange={(e)=>{setPassword(e.target.value),setError('')}} placeholder="Enter Update password"/>
                    <br/>
                    <button className="btn">Submit</button>
                    <br/>
                </form>
                {error && <p style={{color:'red'}}>{error}</p>}
                {success && <p style={{color:'green'}}>{success}</p>}
            </div>
        </div>
    )


}
export default withAuthFetch(UpdateMember)