import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header"
import LibrarianSidebar from "../../components/Librariansidebar"

function ViewMember({authFetch}){
    const [userList,setUserList]=useState([])
   
    const [loading,setLoading]=useState(false)
    
   
    
    async function handleviewuser(){
        
        setLoading(true)
        


        try{

            const response = await authFetch('http://localhost:3000/api/users/logs')
            const data=await response.json()
            
            if(!response.ok){
                toast.error('error while fetching')
                return
            }
            setUserList(data)

        }catch(err){
            console.log(err)
            toast.error('somethiong went wrong,try Again')
        }finally{
            setLoading(false)
        }
    }
    
    async function deactivate(id){
        try{
            const response=await authFetch(`http://localhost:3000/api/users/${id}/deactivate`,{
                method:'PATCH'
            })
            const data=await response.json()
            if(!response.ok){
                toast.error('Error while fetching')
                return
            }
            setUserList(prevlist=>
                prevlist.map(b=>b.id===Number(id)? {...b, is_active:false}:b)
            )
        }catch(err){
            console.log(err)
            toast.error('User is still active')
        }
    }

    useEffect(() => {
        handleviewuser()
    }, [])

    

    return(
        <div className="dash-container">
            <LibrarianSidebar/>
             <Header/>                      
                    
            <div className="table-container">
                {loading && <p>Loading...</p>}
                {!loading && <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>UserName</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Active Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map(user=>(
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                                <td>
                                    <button className="btn" disabled={!user.is_active} onClick={() => deactivate(user.id)}>
                                        {user.is_active ? 'Deactivate' : 'Deactivated'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
            </div>  
       </div>
    )
}

export default withAuthFetch(ViewMember)