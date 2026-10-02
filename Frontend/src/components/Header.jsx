import logo from '../assets/logo.png'
import { FaPlus } from "react-icons/fa"; 

function Header({
    children,
    onCreate,
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
            {showSearch && (<input className="header-input" placeholder={searchPlaceholder} onChange={(e) => onSearch(e.target.value)}/>)}
            {onCreate && (<button className="create-plus" onClick={onCreate}><FaPlus /></button>)}
            {children}
        </div>
    </header>)
}

export default Header