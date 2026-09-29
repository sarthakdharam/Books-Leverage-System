import { useEffect, useState } from "react"
import withAuthFetch from "../../HOC/withAuthFetch"
import { Link ,useNavigate} from "react-router-dom"
import Header from "../../components/Header"
import AdminSidebar from "../../components/Adminsidebar"

function ViewLibrarian({authFetch}){
    const [librarianList,setLibrarianList]=useState([])
    const [error,setError]=useState('')
    const navigate=useNavigate()

    function handlenavigate(){
        return navigate('/admin/dashboard')
    }
   
    
    async function handleviewlibrarian(){
        setError('')

        try{

            const response = await authFetch('http://localhost:3000/api/librarian/logs')
            const data=await response.json()
            setLibrarianList(data)

        }catch(err){
            console.log(err)
            setError('somethiong went wrong,try Again')
        }
    }
    
    async function deactivate(id){
        try{
            const response=await authFetch(`http://localhost:3000/api/librarian/${id}/deactivate`,{
                method:'PATCH'
            })
            const data=await response.json()
            if(!response.ok){
                setError('Error while fetching')
                return
            }
            setLibrarianList(prevlist=>
                prevlist.map(b=>b.id===Number(id)? {...b, is_active:false}:b)
            )
        }catch(err){
            console.log(err)
            setError('Librarain is still active')
        }
    }

    useEffect(() => {
        handleviewlibrarian()
    }, [])

    return(
        <div className="dash-container">
            <AdminSidebar/>
            <Header/>                      
                    
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>UserName</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Branch</th>
                            <th>Status</th>
                            <th>Active Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {librarianList.map(librarian=>(
                            <tr key={librarian.id}>
                                <td>{librarian.id}</td>
                                <td>{librarian.name}</td>
                                <td>{librarian.username}</td>
                                <td>{librarian.email}</td>
                                <td>{librarian.phone}</td>
                                <td>{librarian.branch}</td>
                                <td>{librarian.is_active ? 'Active' : 'Inactive'}</td>
                                <td>
                                    <button className="btn" disabled={!librarian.is_active} onClick={() => deactivate(librarian.id)}>
                                        {librarian.is_active ? 'Deactivate' : 'Deactivated'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {error && <p style={{color:'red'}}>{error}</p>}
            </div>  
       </div>
    )
}

export default withAuthFetch(ViewLibrarian)