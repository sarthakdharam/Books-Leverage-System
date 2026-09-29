import { useState } from "react"
import { useNavigate} from "react-router-dom"
import withAuthFetch from "../../HOC/withAuthFetch"
import Header from "../../components/Header"
import LibrarianSidebar from "../../components/Librariansidebar"


function BorrowBook({authFetch}){

    const [book_id,setBook_Id]=useState('')
    const [user_id,setUser_Id]=useState('')
    const [error,setError]=useState('')
    const [success,setSuccess]=useState('')
    const navigate=useNavigate()

    function handlenavigate(){
        return navigate('/librarian/dashboard')
    }

    async function handleborrow(event){
        event.preventDefault()
        setError('')

        if(Number(user_id)<=0){
            setError('Enter Correct User Id')
            return
        }
        if(Number(book_id)<=0){
            setError('Enter Correct Book Id')
            return
        }
        
        try{
            const response=await authFetch(`http://localhost:3000/api/borrow`,{
                method:'POST',
                body:JSON.stringify({user_id,book_id})
            })

            const data=await response.json()

            if(!response.ok){
                setError('Something went wrong while fetching')
                return
            }

            setSuccess(data.message || 'book borrowed successfully')
            setUser_Id('')
            setBook_Id('')

        }catch(err){
            console.log(err)
            setError('Something went wrong ,try again')
        }
    }

    return(
        <div className="dash-container">
            <LibrarianSidebar/>
            <Header/>   
                                
            <div className="page-container">
                <form onSubmit={handleborrow}>
                    <h3>Borrow Book</h3>
                    <br/>
                    <input className="form-input" value={user_id} onChange={(e)=>{setUser_Id(e.target.value),setError('')}} placeholder="User Id"/>
                    <br/>
                    <input className="form-input" value={book_id} onChange={(e)=>{setBook_Id(e.target.value),setError('')}} placeholder="Book Id"/>
                    <br/>
                    <button className="btn">Submit</button>
                </form>
                {error && <p style={{color:'red'}}>{error}</p>}
                {success && <p style={{color:'green'}}>{success}</p>}
            </div>
        </div>
    )
}

export default withAuthFetch(BorrowBook)