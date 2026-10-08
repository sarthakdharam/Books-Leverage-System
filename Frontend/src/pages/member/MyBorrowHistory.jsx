
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch";
import Header from "../../components/Header";
import MemberSidebar from "../../components/MemberSidebar";

function MyBorrowHistory({authFetch}){

    const [borrowList,setBorrowList]=useState([])
    const [page,setPage]=useState(1)
    const rowsPerPage=8
    const totalPages = Math.ceil(borrowList.length / rowsPerPage);

    const startIndex = (page - 1) * rowsPerPage;
    const currentBorrows = borrowList.slice(startIndex, startIndex + rowsPerPage)
    
    async function handleborrowhistory(){

        try{
            const response=await authFetch(`http://localhost:3000/api/borrow/history`)

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

            const response=await authFetch(`http://localhost:3000/api/myborrow/search?name=${value}`)
            const data=await response.json()

            if(!response.ok){
                toast.error(data.message || 'something failed')
                return
            }

            setBorrowList(data)

        }catch(err){
            console.log(err)
            toast.error('Something went wrong plese try again')}
    }

    useEffect(()=>{
        handleborrowhistory()
    },[])

    return(
        <div className="dash-container">
            <MemberSidebar/>
            <Header 
                showBranding={false} 
                title="MY BORROWS" 
                icon='📚'
                showSearch={true}
                searchPlaceholder="Search Borrow"
                onSearch={handlesearch}
            />                      
                    
            <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Book Id</th>
                                <th>Book Name</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th>Fine Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBorrows.map(borrow=>(
                                <tr key={borrow.id}>
                                    <td>{borrow.book?.id}</td>
                                    <td>{borrow.book?.book_name}</td>
                                    <td>{new Date(borrow.borrow_date).toISOString().split('T')[0]}</td>
                                    <td>{new Date(borrow.due_date).toISOString().split('T')[0]}</td>
                                    <td>{borrow.return_date ? new Date(borrow.return_date).toISOString().split('T')[0] : '-'}</td>
                                    <td>{borrow.status}</td>
                                    <td>{borrow.fine_amount}</td>
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
            </div>
    )
}

export default withAuthFetch(MyBorrowHistory)