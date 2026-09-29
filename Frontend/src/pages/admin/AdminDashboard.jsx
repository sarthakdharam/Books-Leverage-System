import Header from "../../components/Header"
import AdminSidebar from "../../components/Adminsidebar"
import { useEffect, useState } from "react"
import authFetch from "../../utils/authFetch"
import { toast } from "react-toastify"

function AdminDashboard(){

    const [stats,setStats]=useState({})
    // total_books,avctive_book,total_librarian,active_librarian,total_users,active_users,book_issued_count,deleted_member
    async function handlestats(){
        try{

            const response=await authFetch('http://localhost:3000/api/admin/stats')

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
        <div className="dash-container">

            <AdminSidebar/>
            <Header/>
            <div className="dash-grid">    
                <div className="dash-card">
                    <h1>Total Number Of Books</h1>
                    <h1>{stats.total_books}</h1>
                </div>
                <div className="dash-card">
                    <h1>Active Number Of Books</h1>
                    <h1>{stats.avctive_book}</h1>
                </div>
                <div className="dash-card">
                    <h1>Total Number Of Librarians</h1>
                    <h1>{stats.total_librarian}</h1>
                </div>
                <div className="dash-card">
                    <h1>Active Number Of Librarians</h1>
                    <h1>{stats.active_librarian}</h1>
                </div>
                <div className="dash-card">
                    <h1>Total Number Of Members</h1>
                    <h1>{stats.total_users}</h1>
                </div>          
                <div className="dash-card">
                    <h1>Active Number Of Members</h1>
                    <h1>{stats.active_users}</h1>
                </div>
                <div className="dash-card">
                    <h1>Issued Number Of Books</h1>
                    <h1>{stats.book_issued_count}</h1>
                </div>
                <div className="dash-card">
                    <h1>Number Of Member Left</h1>
                    <h1>{stats.deleted_member}</h1>
                </div>
            </div>
        </div>
    )
}
export default AdminDashboard