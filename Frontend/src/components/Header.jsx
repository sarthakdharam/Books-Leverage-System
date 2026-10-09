import logo from '../assets/logo.png'
import { FaPlus,FaUserCircle } from "react-icons/fa"; 
import { BookCategory } from '../constant/BookCategory';

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

            {showCategory && (<select className="header-category" value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
            <option value="">All Categories</option>
            {BookCategory.map(category => (
                <option key={category} value={category}>
                    {category}
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