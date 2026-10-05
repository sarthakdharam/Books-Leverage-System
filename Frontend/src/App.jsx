import { Routes, Route } from 'react-router-dom'
import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import logo from './assets/logo.png'
import Login from './pages/login'
import AdminDashboard from './pages/admin/AdminDashboard'
import LibrarianDashboard from './pages/librarian/LibrarianDashboard'
import MemberDashboard from './pages/member/MemberDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import CreateBook from './pages/books/CreateBook'
import CreateLibrarian from './pages/librarian/CreateLibrarian'
import ViewBook from './pages/books/ViewBook'
import ViewLibrarian from './pages/librarian/ViewLibrarian'
import Updatebook from './pages/books/Updatebook'
import Createuser from './pages/member/CreateMember'
import ViewMember from './pages/member/ViewMember'
import BorrowBook from './pages/books/BorrowBook'
import ReturnBook from './pages/books/ReturnBook'
import ViewBorrow from './pages/librarian/ViewBorrow'
import MyAccount from './pages/librarian/MyAccount'
import UpdateLibrarian from './pages/librarian/UpdateLibrarian'
import UserAccount from './pages/member/UserAccount'
import UpdateMember from './pages/member/UpdateMember'
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
        <Route path='/books/create' element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
                <CreateBook/>
            </ProtectedRoute>}/>
        <Route path='/librarian/create' element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
                <CreateLibrarian/>
            </ProtectedRoute>}/>
        <Route path='/books/view' element={
            <ProtectedRoute allowedRoles={["ADMIN", "LIBRARIAN"]}>
                <ViewBook/>
            </ProtectedRoute>}/>  
        <Route path='/librarian/view' element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ViewLibrarian/>
            </ProtectedRoute>}/> 
        <Route path='/books/update/:id' element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <Updatebook/>
                </ProtectedRoute>}/>      
            <Route path='/user/create' element={
                <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
                    <Createuser/>
                </ProtectedRoute>}/> 
            <Route path='/user/view' element={
                <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
                    <ViewMember/>
                </ProtectedRoute>}/> 
            <Route path='/book/borrow' element={
                <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
                    <BorrowBook/>
                </ProtectedRoute>}/>
            <Route path='/book/return' element={
                <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
                    <ReturnBook/>
                </ProtectedRoute>}/>
            <Route path='/borrow/history' element={
                <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
                    <ViewBorrow/>
                </ProtectedRoute>}/>
            <Route path='/librarian/Myaccount' element={
                <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
                    <MyAccount/>
                </ProtectedRoute>}/>
            <Route path='/librarian/update' element={
                <ProtectedRoute allowedRoles={["LIBRARIAN"]}>
                    <UpdateLibrarian/>
                </ProtectedRoute>}/>
            <Route path='/user/Myaccount' element={
                <ProtectedRoute allowedRoles={["USER"]}>
                    <UserAccount/>
                </ProtectedRoute>}/>
            <Route path='/user/update' element={
                <ProtectedRoute allowedRoles={["USER"]}>
                    <UpdateMember/>
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