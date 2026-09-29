import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import LibrarianSidebar from "../../components/Librariansidebar"


function MyAccount({authFetch}){

    const [account,setAccount]=useState({})

    async function loadaccount(){
            try{

            const response = await authFetch('http://localhost:3000/api/librarian/myaccount')
            const data=await response.json()

            if(!response.ok){
                toast.error('Error while fetching')
            }

            setAccount(data)

        }catch(err){
            console.log(err)
            toast.error('something went wrong while fecthing my info')
        }
    }

    useEffect(()=>{
        loadaccount()
    },[])
    return(
        <div className="dash-container">
            <LibrarianSidebar/>
            <Header/>                      
                
            <div className="page-container">
                <h3>My Accuont</h3>
                <div className="page-container">
                    
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
                            <div className="info-row">
                                <span className="info-label">Branch</span>
                                <span className="info-value">{account.branch}</span>
                            </div>
                        </div>
                        <br/>
                </div>
                <br/>
            </div>
        </div>
    )
}
export default withAuthFetch(MyAccount)