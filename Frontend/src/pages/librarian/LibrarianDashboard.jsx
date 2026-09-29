import Header from "../../components/Header"
import LibrarianSidebar from "../../components/Librariansidebar"
import { useState,useEffect } from "react"
import authFetch from "../../utils/authFetch"

function LibrarianDashboard(){

    const [stats,setStats]=useState({})
    const [error,setError]=useState('')
    // totalMembers, activeMembers, issuedToday, currentlyBorrowed, overdue, dueSoon
    async function handlestats(){
        setError('')
        try{

            const response=await authFetch('http://localhost:3000/api/librarian/stats')

            const data=await response.json()

            if(!response.ok){
                setError('error For fetching data')
                return
            }
            setStats(data)
        }catch(err){
            console.log(err)
            setError('Something went wrong while fetching')
        }
    }
    useEffect(()=>{
        handlestats()
    },[stats])
    return(
        <div className="dash-container" >
            <LibrarianSidebar/>
            <Header/>
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
        {error && <p style={{color:'red'}}>{error}</p>}
        </div>
        
    )
}
export default LibrarianDashboard