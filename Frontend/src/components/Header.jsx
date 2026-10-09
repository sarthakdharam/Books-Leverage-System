import logo from '../assets/logo.png'
import { FaPlus,FaUserCircle } from "react-icons/fa"; 
import { BookCategory } from '../constant/BookCategory';
import { useEffect, useState } from 'react';
import authFetch from '../utils/authFetch';
import { toast } from 'react-toastify';

function Header({
    children,
    onBorrow,
    onCreate,
    onCategoryChange,
    createtitle='create account',
    onReduce,
    myAccount,
    showSearch = false,
    searchPlaceholder = "Search",
    onSearch,
    showCategory=false,
    selectedCategory='',
    showBranding = true,
    title = "Books Leverage System",
    icon,
    showBranch = false,
    selectedBranch = "",
    onBranchChange,
    authFetch
}){
    const [branches, setBranches] = useState([])

    async function handleBranch(){
        try{
            const response=await authFetch('http://localhost:3000/api/librarian/branches')
            const data=await response.json()
            if(!response.ok){
                toast.error('Somethinf went wrong while fetching')
                return
            }
            const UniqueBranches=[...new Set(data
                .map(librarian=>librarian.branch)
                .filter(Boolean)
            )].sort()
            setBranches(UniqueBranches)
        }catch(err){
            console.log(err)
            toast.error('Something went wrong,Try again')
        }
    }

    useEffect(()=>{
        if(!showBranch) return
        handleBranch()
    },[showBranch,authFetch])

    return (
    <header className='app-header'>
        <div className='header-brand'>

            {showBranding ? (
                    <>
                        <img src={logo} alt="Library logo" className="header-logo"/>
                        <span className="header-title">{title}</span>
                    </>
                    ) : (
                    <>
                        <span className="page-icon">{icon}</span>
                        <span className="header-title">{title}</span>
                    </>
                )}
        </div>
        <div className='header-actions'>

            {showCategory && (<select className="header-category" value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
            <option value="">All Categories</option>
            {BookCategory.map(category => (
                <option key={category} value={category}>
                    {category}
                </option>
            ))}
            </select>
            )}
            {showBranch && (<select className="header-category" value={selectedBranch} onChange={(e) => onBranchChange(e.target.value)}>
                <option value="">All Branches</option>
                    {branches.map(branch => (
                        <option key={branch} value={branch}>
                            {branch}
                        </option>
                    ))}
                </select>
            )}
            {showSearch && (<input className="header-input" placeholder={searchPlaceholder} title='search here' onChange={(e) => onSearch(e.target.value)}/>)}
            {onCreate && (<button className="create-plus" onClick={onCreate} title={createtitle}><FaPlus /></button>)}
            {onBorrow && (<button className="create-plus1" onClick={onBorrow} title={createtitle}>Borrow</button>)}
            {onReduce && (<button className="create-plus1" onClick={onReduce} title='return'>Return</button>)}
            {myAccount && (<button className="myaccount-btn" onClick={myAccount} title='My Account'><FaUserCircle size={30} color="#e9dede"/></button>)}
            {children}
        </div>
    </header>)
}

export default Header