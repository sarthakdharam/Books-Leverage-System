
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header";
import LibrarianSidebar from "../../components/Librariansidebar";

function ViewBorrow({authFetch}){

    const [borrowList,setBorrowList]=useState([])

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

    useEffect(()=>{
        handleborrowhistory()
    },[])
    return(
        <div className="dash-container">
            <LibrarianSidebar/>
            <Header/>                      
                    
            <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Librarian Id</th>
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
                            {borrowList.map(borrow=>(
                                <tr key={borrow.id}>
                                    <td>{borrow.librarian?.id}</td>
                                    <td>{borrow.book?.book_name}</td>
                                    <td>{borrow.user?.name}</td>
                                    <td>{new Date(borrow.borrow_date).toLocaleDateString()}</td>
                                    <td>{new Date(borrow.due_date).toLocaleDateString()}</td>
                                    <td>{borrow.return_date ? new Date(borrow.return_date).toLocaleDateString() : '-'}</td>
                                    <td>{borrow.status}</td>
                                    <td>{borrow.fine_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
    )
}
export default withAuthFetch(ViewBorrow)
