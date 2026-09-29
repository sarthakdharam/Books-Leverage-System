import { useState } from "react"
import { toast } from "react-toastify";
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header";
import LibrarianSidebar from "../../components/Librariansidebar";


function ReturnBook({authFetch}){

    const [book_id,setBook_Id]=useState('')
    const [user_id,setUser_Id]=useState('')

    async function handlereturn(event){
        event.preventDefault()

         if(Number(user_id)<=0){
            toast.error('Enter Correct User Id')
            return
        }
        if(Number(book_id)<=0){
            toast.error('Enter Correct Book Id')
            return
        }

        try{
            const response=await authFetch(`http://localhost:3000/api/borrow/return`,{
                method:'PATCH',
                body:JSON.stringify({user_id,book_id})
            })

            const data=await response.json()

            if(!response.ok){
                toast.error('Something went wrong while fetching')
                return
            }

            toast.success(data.message || 'book returned successfully')
            setUser_Id('')
            setBook_Id('')

        }catch(err){
            console.log(err)
            toast.error('Something went wrong ,try again')
        }
    }

    return(
        <div className="dash-container">
            <LibrarianSidebar/>
            <Header/>                      
                    
            <div className="page-container">
                <form onSubmit={handlereturn}>
                    <h3>Return Book</h3>
                    <br/>
                    <input className="form-input" value={user_id} onChange={(e)=>setUser_Id(e.target.value)} placeholder="User Id"/>
                    <br/>
                    <input className="form-input" value={book_id} onChange={(e)=>setBook_Id(e.target.value)} placeholder="Book Id"/>
                    <br/>
                    <button className="btn">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default withAuthFetch(ReturnBook)