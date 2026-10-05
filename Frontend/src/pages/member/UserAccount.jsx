
import withAuthFetch from "../../HOC/withAuthFetch";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import UpdateMember from "./UpdateMember";



function UserAccount({authFetch,onClose}){

    const [account,setAccount]=useState({})
    const [showUpdate,setShowUpdate]=useState(false)

    

    async function loadaccount(){
        try{

            const response = await authFetch('http://localhost:3000/api/users/myaccount')
            const data=await response.json()

            if(!response.ok){
                toast.error('Error while fetching')
                return
            }

            setAccount(data)
            

        }catch(err){
            console.log(err)
            toast.error('Something went wrong while loading')
        }
    }

    useEffect(()=>{
        loadaccount()
    },[])
    return(
        <div className="modal-overlay1" onClick={onClose}>                     
                   
            <div className="page-container modal-form1" onClick={(e) => e.stopPropagation()}>     
                <div className="form-header"><h3>My Account</h3> 
                <button type="button" className="update-btn" onClick={()=>setShowUpdate(true)}><FaEdit/></button>
                <button type="button" className="close-btn" onClick={onClose} title="close">×</button>
            </div>
                <div className="page-container1">
                    
                        <div key={account.id}>
                            <div className="info-row">
                                <span className="info-label">ID</span>
                                <span className="info-value">{account.id}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Username</span>
                                <span className="info-value">{account.username}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Name</span>
                                <span className="info-value">{account.name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email</span>
                                <span className="info-value">{account.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Phone No.</span>
                                <span className="info-value">{account.phone}</span>
                            </div>
                        </div>
                </div>
            </div>
            {showUpdate && (<UpdateMember authFetch={authFetch} onClose={()=>setShowUpdate(false)} onCreated={loadaccount}/>)}
        </div>
    )
}
export default withAuthFetch(UserAccount)