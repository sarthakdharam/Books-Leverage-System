import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import withAuthFetch from "../../HOC/withAuthFetch"

function BookPage({authFetch,id,onClose}){

    const [description,setDescription]=useState({})

    async function handlebookpage(){

        try{
            const response=await authFetch('http://localhost:3000/api/books')

            const data=await response.json()

            if(!response.ok){
                toast.error('Error while fetching data')
                return
            }

            const foundbook=data.find(book=>(book.id===Number(id)))
            setDescription(foundbook)

        }catch(err){
            console.log(err)
            toast.error('Something went wrong , try again')
        }
    }
    useEffect(()=>{
        handlebookpage()
    },[id])
    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="page-container modal-form2" onClick={(e) => e.stopPropagation()}>     
                <div className="form-header"><h3>BOOK DETAILS</h3> 
                <button type="button" className="close-btn1" onClick={onClose} title="close">×</button>
            </div>
            <div className="page-card">
            <span className="book-category-badge1">{description.category}</span>
            <img
                src={description.book_image || 'https://via.placeholder.com/160x220?text=No+Cover'}
                className="book-cover"
            />   
            <h4 className="book-title">{description.book_name}</h4>
            <p className="book-author">{description.book_author}</p>
            <p>{description.book_description}</p>
            </div>     
            </div>    
        </div>
    )
}
export default withAuthFetch(BookPage)