
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch";
import Header from "../../components/Header";
import MemberSidebar from "../../components/MemberSidebar";

function MyBorrowHistory({authFetch}){

    const [borrowList,setBorrowList]=useState([])
    
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
                            {borrowList.map(borrow=>(
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
                </div>
            </div>
    )
}

export default withAuthFetch(MyBorrowHistory)