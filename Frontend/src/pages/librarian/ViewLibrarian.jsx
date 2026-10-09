import { useEffect, useState } from "react"
import withAuthFetch from "../../HOC/withAuthFetch"
import { toast } from "react-toastify"
import Header from "../../components/Header"
import AdminSidebar from "../../components/Adminsidebar"
import CreateLibrarian from "./CreateLibrarian"
import ConfirmActivatelibrarian from "./ConfirmActivateLibrarian"
import ConfirmDeactivateLib from "./ConfirmDeactivateLib"

function ViewLibrarian({authFetch}){
    const [librarianList,setLibrarianList]=useState([])
    const [showCreateLibrarian,setShowCreateLibrarian]=useState(false)
    const [showActivateConfirm, setShowActivateConfirm] = useState(false)
    const [selectedLibrarianId, setSelectedLibrarianId] = useState(null)
    const [showDeativateConfirm,setShowDeativateConfirm]=useState(false)
    const [selectedBranch, setSelectedBranch] = useState('')
    const [page,setPage]=useState(1)
    const rowsPerPage=8
    const filteredBranch = librarianList.filter(librarian =>
        selectedBranch === "" || librarian.branch === selectedBranch
    )
    const totalPages = Math.ceil(filteredBranch.length / rowsPerPage)

    const startIndex = (page - 1) * rowsPerPage
    const currentlibrarians = filteredBranch.slice(startIndex,startIndex + rowsPerPage)
    
   
    
    async function handleviewlibrarian(){

        try{

            const response = await authFetch('http://localhost:3000/api/librarian/logs')
            const data=await response.json()
            setLibrarianList(data)

        }catch(err){
            console.log(err)
            toast.error('somethiong went wrong,try Again')
        }
    }
    
    async function deactivate(id){
        try{
            const response=await authFetch(`http://localhost:3000/api/librarian/${id}/deactivate`,{
                method:'PATCH'
            })
            const data=await response.json()
            if(!response.ok){
                toast.error('Error while fetching')
                return
            }
            setLibrarianList(prevlist=>
                prevlist.map(b=>b.id===Number(id)? {...b, is_active:false}:b)
            )

            toast.success('Librarian Deactivated Successfully')
        }catch(err){
            console.log(err)
            toast.error('Librarain is still active')
        }
    }

    async function activate(id){
        try{
            const response=await authFetch(`http://localhost:3000/api/librarian/${id}/activate`,{
                method:'PATCH'
            })
            const data=await response.json()
            if(!response.ok){
                toast.error('Error while fetching')
                return
            }
            setLibrarianList(prevlist=>
                prevlist.map(b=>b.id===Number(id)? {...b, is_active:true}:b)
            )
            toast.success('Librarian Activated Successfully')
        }catch(err){
            console.log(err)
            toast.error('Librarain is still deactivate')
        }
    }

    async function handlesearch(value){
        try{

            const response=await authFetch(`http://localhost:3000/api/librarian/search?name=${value}`)

            const data=await response.json()

            if(!response.ok){
                toast.error(data.message || 'something failed')
                return
            }
            setLibrarianList(data)
        }catch(err){
            console.log(err)
            toast.error('Something went wrong plese try again')
        }
    }

    useEffect(() => {
        handleviewlibrarian()
    }, [])

    function handleActivateClick(id) {
        setSelectedLibrarianId(id)
        setShowActivateConfirm(true)
    }

    function handleDeactivateClick(id) {
        setSelectedLibrarianId(id)
        setShowDeativateConfirm(true)
    }

    return(
        <div className="dash-container">
            <AdminSidebar/>
            <Header 
            authFetch={authFetch}
                showBranding={false}
                title="LIBRARIAN"
                icon="👨🏽‍💼"
                showSearch={true}
                searchPlaceholder="Search Librarian"
                onSearch={handlesearch}
                onCreate={() => setShowCreateLibrarian(true)}
                showBranch={true}
                selectedBranch={selectedBranch}
                onBranchChange={(branch)=>{
                    setSelectedBranch(branch)
                    setPage(1)
                }}
                />                      
                    
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
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
                        {currentlibrarians.map(librarian=>(
                            <tr key={librarian.id}>
                                <td>{librarian.name}</td>
                                <td>{librarian.username}</td>
                                <td>{librarian.email}</td>
                                <td>{librarian.phone}</td>
                                <td>{librarian.branch}</td>
                                <td>{librarian.is_active ? 'Active' : 'Inactive'}</td>
                                <td>
                                    <button className="btn" onClick={() => librarian.is_active ? handleDeactivateClick(librarian.id):handleActivateClick(librarian.id)}>
                                        {librarian.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='Pagination' >
                    <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    >
                    Previous
                    </button>

                    <span style={{ margin: "0 10px" }}>
                    Page {page} of {totalPages}
                    </span>

                    <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    >
                    Next
                    </button>
            </div>
            </div> 
            {showCreateLibrarian && (<CreateLibrarian authFetch={authFetch} onClose={()=>setShowCreateLibrarian(false)} onCreated={handleviewlibrarian}/>)} 
            {showActivateConfirm && (<ConfirmActivatelibrarian onConfirm={async () => {await activate(selectedLibrarianId)
                        setShowActivateConfirm(false)}} onClose={() => setShowActivateConfirm(false)}/>
            )}
            {showDeativateConfirm && (<ConfirmDeactivateLib onConfirm={async () => {await deactivate(selectedLibrarianId) 
                setShowDeativateConfirm(false)}} onClose={() => setShowDeativateConfirm(false)}/>)}
       </div>
    )
}

export default withAuthFetch(ViewLibrarian)
