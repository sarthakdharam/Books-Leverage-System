import SearchBook from "../books/SearchBook"
import Header from "../../components/Header"
import MemberSidebar from "../../components/MemberSidebar"

function MemberDashboard(){

    
    return(
        <div className="dash-container">
            <MemberSidebar/>
            <Header/>
                
            
            <div style={{ 
                marginLeft:'250px',
                marginTop:'50px'
             }}>
                <SearchBook></SearchBook>
            </div>
        </div>
        
    )
}
export default MemberDashboard