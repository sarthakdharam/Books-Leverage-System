import SearchBook from "../books/SearchBook"
import Header from "../../components/Header"
import MemberSidebar from "../../components/MemberSidebar"
import withAuthFetch from "../../HOC/withAuthFetch";
import { useState } from "react";
import UserAccount from "./UserAccount";

function MemberDashboard({authFetch}){

    const [showMyAccount, setShowMyAccount] = useState(false);
    
    return(
        <div className="dash-container">
            <MemberSidebar/>
            <Header 
                showBranding={true}
                myAccount={()=>setShowMyAccount(true)}
            />
                
            
            <div>
                <SearchBook></SearchBook>
            </div>

            {showMyAccount &&(<UserAccount authFetch={authFetch} onClose={()=>setShowMyAccount(false)}/>)}
        </div>
        
    )
}
export default withAuthFetch(MemberDashboard)