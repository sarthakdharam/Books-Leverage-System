
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header";
import LibrarianSidebar from "../../components/Librariansidebar";
import BorrowBook from "../books/BorrowBook";
import ReturnBook from "../books/ReturnBook";

function ViewBorrow({authFetch , }){

    const [borrowList,setBorrowList]=useState([])
    const [showborrowbook,setShowBorrowBook]=useState(false)
    const [showreturnbook,setShowReturnBook]=useState(false)

    async function handleborrowhistory(){

        try{
            const response=await authFetch(`http://localhost:3000/api/borrow/logs`)

            const data=await response.json()

            if(!response.ok){
                toast.error('Something went wrong while fetching')
                return
            }

            setBorrowList(data)
        }catch(err){
            console.log(err)
            toast.error('Something went wrong ,try again')
        }
    }

    async function handlesearch(value){
        try{
            if(value.trim()===''){
                handleborrowhistory()
                return
            }

            const response=await authFetch(`http://localhost:3000/api/borrow/search?name=${value}`)
            const data=await response.json()

            if(!response.ok){
                toast.error(data.message || 'something failed')
                return
            }

            setBorrowList(data)
        }catch(err){
            console.log(err)
            toast.error('Something went wrong please try again')
        }
        
    }
    

    useEffect(()=>{
        handleborrowhistory()
    },[])
    return(
        <div className="dash-container">
            <LibrarianSidebar/>
            <Header 
                showBranding={false}
                title="BOOKS"
                icon="📚"
                showSearch={true}
                searchPlaceholder = "Search Borrow" 
                onSearch={handlesearch}
                createtitle="Borrow"
                onCreate={()=>setShowBorrowBook(true)}
                onReduce={()=>setShowReturnBook(true)}

            />                      
                    
            <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Borrowed Id</th>
                                <th>Book Name</th>
                                <th>User Name</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th>Fine Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowList.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="no-data">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                            borrowList.map(borrow=>(
                                <tr key={borrow.id}>
                                    <td>{borrow.id}</td>
                                    <td>{borrow.book?.book_name}</td>
                                    <td>{borrow.user?.name}</td>
                                    <td>{new Date(borrow.borrow_date).toISOString().split('T')[0]}</td>
                                    <td>{new Date(borrow.due_date).toISOString().split('T')[0]}</td>
                                    <td>{borrow.return_date ? new Date(borrow.return_date).toISOString().split('T')[0] : '-'}</td>
                                    <td>{borrow.status}</td>
                                    <td>{borrow.fine_amount}</td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
                {showborrowbook &&(<BorrowBook authFetch={authFetch} onClose={()=>setShowBorrowBook(false)} onCreated={handleborrowhistory}/>)}
                {showreturnbook &&(<ReturnBook authFetch={authFetch} onClose={()=>setShowReturnBook(false)} onCreated={handleborrowhistory}/>)}
            </div>
    )
}
export default withAuthFetch(ViewBorrow)
