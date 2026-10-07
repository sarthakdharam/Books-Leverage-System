import logo from '../assets/logo.png'
import { FaPlus,FaUserCircle,FaMinus } from "react-icons/fa"; 

function Header({
    children,
    onBorrow,
    onCreate,
    createtitle='create account',
    onReduce,
    myAccount,
    showSearch = false,
    searchPlaceholder = "Search",
    onSearch,
    showBranding = true,
    title = "Books Leverage System",
    icon
}){


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