import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

function AdminSidebar() {

  function handleLogout(){
    return localStorage.clear()
  }
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <img src={logo} alt="Books Leverage System" />
      </div>

      <nav className="sidebar-menu">

        <NavLink to="/admin/dashboard">
          🏠 Dashboard
        </NavLink>

        <NavLink to="/books/view">
          📚 Books
        </NavLink>

        <NavLink to="/librarian/create">
          👨🏽‍💼 Create Librarian
        </NavLink>

        <NavLink to="/librarian/view">
          👨🏽‍💼 View Librarians
        </NavLink>


      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/login" onClick={handleLogout}>
          🚪 Logout
        </NavLink>
      </div>

    </aside>
  );
}

export default AdminSidebar;