
import withAuthFetch from "../../HOC/withAuthFetch";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import MemberSidebar from "../../components/MemberSidebar";


function UserAccount({authFetch}){

    const [account,setAccount]=useState({})
    const [error,setError]=useState('')

    

    async function loadaccount(){
        setError('')
            try{

            const response = await authFetch('http://localhost:3000/api/users/myaccount')
            const data=await response.json()

            if(!response.ok){
                setError('Error while fetching')
            }

            setAccount(data)

        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        loadaccount()
    },[])
    return(
        <div className="dash-container">
            <MemberSidebar/>
            <Header/>                      
                   
            <div className="page-container">
                <h3>My Accuont</h3>
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
                        <br/>
                </div>
                <br/>
                {error && <p style={{color:'red'}}>{error}</p>}
            </div>
        </div>
    )
}
export default withAuthFetch(UserAccount)