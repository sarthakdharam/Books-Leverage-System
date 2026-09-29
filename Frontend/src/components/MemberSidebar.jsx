import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

function MemberSidebar() {

    function handlelogout(){
        return localStorage.clear()
    }
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <img src={logo} alt="Books Leverage System" />
      </div>

      <nav className="sidebar-menu">

        <NavLink to="/member/dashboard">
          🏠 Dashboard
        </NavLink>

        <NavLink to="/Myborrow">
          📚 My Borrow
        </NavLink>

        <NavLink to="/user/Myaccount">
          👦🏽 My Account
        </NavLink>

        <NavLink to="/user/update">
          ✏️ Edit Info...
        </NavLink>


      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/login" onClick={handlelogout}>
          🚪 Logout
        </NavLink>
      </div>

    </aside>
  );
}

export default MemberSidebar;