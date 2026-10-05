import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import logo from '../assets/logo.png'

function Login(){

    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate()
    const [isSubmitting,setIsSubmitting]=useState(false)

    async function handleSubmit(event){
        event.preventDefault() 

        if(isSubmitting)return
        setIsSubmitting(true)
        try{
            const response=await fetch('http://localhost:3000/api/login',{
                method:"POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({username,password})
            })


            const data=await response.json()

            if(!response.ok){
                toast.error(data.message || 'login failed')
                return
            }

            localStorage.setItem('accessToken',data.accessToken)
            localStorage.setItem('refreshToken',data.refreshToken)
            localStorage.setItem('role',data.role)

            if(data.role==='ADMIN') navigate('/admin/dashboard')
            else if(data.role==='LIBRARIAN') navigate('/librarian/dashboard')
            else if(data.role==='USER') navigate('/member/dashboard')
            console.log("login as:",data.role)

        }catch(err){
            console.log(err)
            toast.error('somethiong went wrong,try Again')
        }finally{
            setIsSubmitting(false)
        }

        
    }


    return(
        <div className="login-page">
            <img src={logo} alt='Libaray logo' className="login-logo"/>
            <div className="page-container">
                <h1 className="normal-text">Login Page</h1>
                <form onSubmit={handleSubmit} >
                    <input className="form-input" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="username"/><br></br>
                    <br></br>
                    <input className="form-input" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="password"/><br></br>
                    <br></br>
                    <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting?(<span className="loader"></span>):('Login')}</button>
                </form>
            </div>
        </div>
    )

}

export default Login