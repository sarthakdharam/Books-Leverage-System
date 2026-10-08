import { Routes, Route } from 'react-router-dom'
import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/login'
import AdminDashboard from './pages/admin/AdminDashboard'
import LibrarianDashboard from './pages/librarian/LibrarianDashboard'
import MemberDashboard from './pages/member/MemberDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ViewBook from './pages/books/ViewBook'
import ViewLibrarian from './pages/librarian/ViewLibrarian'
import ViewMember from './pages/member/ViewMember'
import ViewBorrow from './pages/librarian/ViewBorrow'
import MyBorrowHistory from './pages/member/MyBorrowHistory'

function App() {
  return (
    <>
        <Routes>
            
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard/>
            </ProtectedRoute>}/>
        <Route path='/librarian/dashboard' element={
            <ProtectedRoute allowedRoles={["LIBRARIAN"]}> 
                <LibrarianDashboard/>
            </ProtectedRoute>}/>
        <Route path='/member/dashboard' element={
            <ProtectedRoute allowedRoles={["USER"]}> 
                <MemberDashboard/>
            </ProtectedRoute>}/>
        <Route path='/books/view' element={
            <ProtectedRoute allowedRoles={["ADMIN", "LIBRARIAN"]}>
                <ViewBook/>
            </ProtectedRoute>}/>  
        <Route path='/librarian/view' element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ViewLibrarian/>
            </ProtectedRoute>}/>
            <Route path='/user/view' element={
                <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
                    <ViewMember/>
                </ProtectedRoute>}/>
            <Route path='/borrow/history' element={
                <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
                    <ViewBorrow/>
                </ProtectedRoute>}/>
            <Route path='/Myborrow' element={
                <ProtectedRoute allowedRoles={["USER"]}>
                    <MyBorrowHistory/>
                </ProtectedRoute>}/>
        </Routes>

        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
        />
    </>
  )
}

export default App