import logo from '../assets/logo.png'

function Header({children}){
    return (
    <header className='app-header'>
        <div className='header-brand'>
            <img src={logo} alt='Library logo' className='header-logo'/>
            <span className='header-title'>Books Leverage System</span>
        </div>
        <div className='header-actions'>
            {children}
        </div>
    </header>)
}

export default Header