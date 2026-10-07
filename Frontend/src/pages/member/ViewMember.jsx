import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import CreateMember from "./CreateMember"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header"
import LibrarianSidebar from "../../components/Librariansidebar"
import ConfirmActivatemember from "./ConfirmActivatemember"
import ConfirmDeactivateMember from "./ConfirmDeactivateMember"

function ViewMember({authFetch}){
    const [userList,setUserList]=useState([])
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [loading,setLoading]=useState(false)
    const [showActivateConfirm, setShowActivateConfirm] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [showDeativateConfirm,setShowDeativateConfirm]=useState(false)
   
    
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

    async function activate(id){
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
                prevlist.map(b=>b.id===Number(id)? {...b, is_active:true}:b)
            )
        }catch(err){
            console.log(err)
            toast.error('User is still deactivate')
        }
    }

    async function handlesearch(value){
        try{
            if(value.trim()===''){
                handleviewuser()
                return
            }

            const response=await authFetch(`http://localhost:3000/api/users/search?name=${value}`)
            const data=await response.json()

            if(!response.ok){
                toast.error(data.message || 'something failed')
                return
            }

            setUserList(data)

        }catch(err){
            console.log(err)
            toast.error('Something went wrong plese try again')}
    }

    useEffect(() => {
        handleviewuser()
    },[])

    function handleActivateClick(id) {
        setSelectedUserId(id)
        setShowActivateConfirm(true)
    }
    function handleDeactivateClick(id) {
        setSelectedUserId(id)
        setShowDeativateConfirm(true)
    }

    return(
        <div className="dash-container">
            <LibrarianSidebar/>
            <Header 
                showBranding={false}
                title="MEMBERS"
                icon="👥"
                showSearch={true}
                searchPlaceholder="Search Member"
                onSearch={handlesearch}
                onCreate={() => setShowCreateUser(true)}
            />                      
                    
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
                                    <button className="btn"  onClick={() => {user.is_active ? handleDeactivateClick(user.id):handleActivateClick(user.id)}}>
                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
            </div>  

            {showCreateUser && (<CreateMember authFetch={authFetch}  onClose={()=> setShowCreateUser(false)} onCreated={handleviewuser}/>)}
            {showActivateConfirm && (<ConfirmActivatemember onConfirm={async () => {await activate(selectedUserId)
                        setShowActivateConfirm(false)}} onClose={() => setShowActivateConfirm(false)}/>
            )}
            {showDeativateConfirm && (<ConfirmDeactivateMember onConfirm={async () => {await deactivate(selectedUserId) 
                setShowDeativateConfirm(false)}} onClose={() => setShowDeativateConfirm(false)}/>)}
       </div>
    )
}

export default withAuthFetch(ViewMember)