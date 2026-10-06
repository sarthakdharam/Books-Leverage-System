import { useState,useEffect } from "react"
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch"


function UpdateLibrarian({authFetch,onClose,onCreated}){

    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [phone,setPhone]=useState('')
    const [password,setPassword]=useState('')
    const [isSubmitting,setIsSubmitting]=useState(false)

   

    async function handleupdate(event){
        event.preventDefault()

        if(isSubmitting)return

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/

        if(email.trim() !== '' && !emailPattern.test(email.trim())){
            toast.error('Enter a valid email address')
            return
        }

        if(phone.trim() !== '' && phone.trim().length !== 10){
            toast.error('Phone number should be 10 digits')
            return
        }
        setIsSubmitting(true)

        try{

            const response=await authFetch('http://localhost:3000/api/librarian/myaccount',{
                method:'PATCH',
                body:JSON.stringify({name,email,phone,password})
            })
            const data=await response.json()

            if(!response.ok){
                toast.error('Error while fetching')
                return
            }

            toast.success(data.message || 'Upadted Successfully')
            onCreated()
            onClose()



        }catch(err){
            console.log(err)
            toast.error('Something went wrong, try agian')
        }finally{
            setIsSubmitting(false)
        }

    }

    useEffect(()=>{
        async function loadlibrarian(){
            try{

            const response = await authFetch('http://localhost:3000/api/librarian/myaccount')
            const data=await response.json()

            if(!response.ok){
                toast.error('Error while loading data')
                return
            }
            setName(data.name)
            setEmail(data.email)
            setPhone(data.phone)
            setPassword(data.password)
            

        }catch(err){
            console.log(err)
            toast.error('something went wrong ,try again')
        }
        }

        loadlibrarian()
    },[])

    

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
                    <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ?(<span className="loader">Submitting...</span>):('Submit')}</button>
                    
                </form>
            </div>
        </div>
    )


}
export default withAuthFetch(UpdateLibrarian)