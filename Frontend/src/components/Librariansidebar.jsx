import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

function LibrarianSidebar() {

    function handlelogout(){
        return localStorage.clear()
    }
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <img src={logo} alt="Books Leverage System" />
      </div>

      <nav className="sidebar-menu">

        <NavLink to="/librarian/dashboard">
          🏠 Dashboard
        </NavLink>

        <NavLink to="/user/view">
          👥 Members
        </NavLink>

        <NavLink to="/borrow/history">
          📕➡️  Books
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

export default LibrarianSidebar;