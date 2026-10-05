import Header from "../../components/Header"
import LibrarianSidebar from "../../components/Librariansidebar"
import { useState,useEffect } from "react"
import { toast } from "react-toastify"
import authFetch from "../../utils/authFetch"
import MyAccount from "./MyAccount"

function LibrarianDashboard(){

    const [showmyaccount,setShowMyAccount]=useState(false)

    const [stats,setStats]=useState({})
    // totalMembers, activeMembers, issuedToday, currentlyBorrowed, overdue, dueSoon
    async function handlestats(){
        try{

            const response=await authFetch('http://localhost:3000/api/librarian/stats')

            const data=await response.json()

            if(!response.ok){
                toast.error('error For fetching data')
                return
            }
            setStats(data)
        }catch(err){
            console.log(err)
            toast.error('Something went wrong while fetching')
        }
    }
    useEffect(()=>{
        handlestats()
    },[stats])
    return(
        <div className="dash-container" >
            <LibrarianSidebar/>
            <Header myAccount={()=>setShowMyAccount(true)}/>

            <div className="dash-grid">    
                <div className="dash-card">
                    <h1>Total Number Of Users</h1>
                    <h1>{stats.totalMembers}</h1>
                </div>
                <div className="dash-card">
                    <h1>Active Number Of Users</h1>
                    <h1>{stats.activeMembers}</h1>
                </div>
                <div className="dash-card">
                    <h1>Today's History</h1>
                    <h1>{stats.issuedToday}</h1>
                </div>
                <div className="dash-card">
                    <h1>Current Borrowed</h1>
                    <h1>{stats.currentlyBorrowed}</h1>
                </div>
                <div className="dash-card">
                    <h1>Overdue</h1>
                    <h1>{stats.overdue}</h1>
                </div>          
                <div className="dash-card">
                    <h1>DueSoon</h1>
                    <h1>{stats.dueSoon}</h1>
                </div>                
            </div>   
            {showmyaccount && (<MyAccount authFetch={authFetch} onClose={()=>setShowMyAccount(false)}/>)}     
        </div>
        
    )
}
export default LibrarianDashboard