import { useState ,useEffect} from "react"
import { toast } from "react-toastify";
import myuser from "../../assets/user_default.png"


function UpdateMember({onClose,onCreated}){

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        user_photo: null
    })
    const [photoPreview, setPhotoPreview] = useState(myuser)
    const [isSubmitting,setIsSubmitting]=useState(false)    



    async function handleupdate(event){
        event.preventDefault()
        
        if(isSubmitting)return

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/

        if(form.email.trim() !== '' && !emailPattern.test(form.email.trim())){
            toast.error('Enter a valid email address')
            return
        }

        if(form.phone.trim() !== '' && form.phone.trim().length !== 10){
            toast.error('Phone number should be 10 digits')
            return
        }

        const passwordvalid=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=])[A-Za-z\d@$!%*?&#^()_+\-=]{8,}$/
        if(form.password){
            if(!passwordvalid.test(form.password)){
                toast.error('use 8+ character with Uppercase,Lowercase,Number and Special Character')
                return
            }
        }

        const formData = new FormData()

        Object.entries(form).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                formData.append(key, value)
            }
        })
        setIsSubmitting(true)

        try{
            const token = localStorage.getItem('accessToken')
            const response=await fetch('http://localhost:3000/api/users/myaccount',
            {
                method:'PATCH',
                headers: {Authorization: `Bearer ${token}`},
                body:formData
            })
            const data=await response.json()

            if(!response.ok){
                toast.error('Error while fetching')
                return
            }

            toast.success(data.message || 'Upadted Successfully')
            setForm({
                name: '',
                email: '',
                phone: '',
                password: '',
                user_photo: null
            })

            setPhotoPreview(myuser)
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
            async function loadmember(){
                try{
                const token = localStorage.getItem('accessToken')
                const response = await fetch('http://localhost:3000/api/users/myaccount',{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data=await response.json()
    
                if(!response.ok){
                    toast.error(data.message || 'Error while loading data')
                    return
                }
                setForm(prev => ({...prev,
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '', 
                    password: '',
                    user_photo: null
                }))
                
                if (data.user_photo) {
                    setPhotoPreview(data.user_photo)
                }
    
            }catch(err){
                console.log(err)
                toast.error('something went wrong ,try again')
            }
            }
    
            loadmember()
        },[])    

        function handlePhotoChange(event) {
                
            const file = event.target.files?.[0]
            if (!file) return

            const allowedTypes = ['image/jpeg','image/png','image/webp']

            if (!allowedTypes.includes(file.type)) {
                toast.error('Choose a JPG, PNG or WebP image')
                event.target.value = ''
                return
            }

            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size must be 2 MB or less')
                event.target.value = ''
                return
            }

            setForm(prev => ({...prev,user_photo: file}))
            setPhotoPreview(URL.createObjectURL(file))
        }

    return(
        <div className="modal-overlay2" onClick={onClose}>                    
                    
            <div className="page-container modal-form1" onClick={(e) => e.stopPropagation()}>     
                <div className="form-header"><h3>Update Info</h3> 
                <button type="button" className="close-btn1" onClick={onClose} title="close">×</button>
            </div>
                <form onSubmit={handleupdate}>
                    <h3> Upload Profile photo</h3>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange}/>
                    <img src={photoPreview} alt="Profile preview" className="user-logo" />
                    <h3>Name</h3>
                    <input className="form-input" value={form.name} onChange={(e)=>setForm(prev=>({...prev,name:e.target.value}))} placeholder="Enter name"/>
                    <h3>Email</h3>
                    <input className="form-input" value={form.email} onChange={(e)=>setForm(prev=>({...prev,email:e.target.value}))} placeholder="Enter email"/>
                    <h3>Phone No.</h3>
                    <input className="form-input" value={form.phone} onChange={(e)=>setForm(prev=>({...prev,phone:e.target.value}))} placeholder="Enter phone no."/>
                    <h3>Password</h3>
                    <input className="form-input" value={form.password} type="password" onChange={(e)=>setForm(prev=>({...prev,password:e.target.value}))} placeholder="Enter password"/>
                    <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting?(<span className="loader">Submitting...</span>):('Submit')}</button>
                </form>
            </div>
        </div>
    )


}
export default UpdateMember