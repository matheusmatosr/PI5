import './header.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

function Header() {
    return (
        <header>
            <Link to="/"><img className='logo' src={logo} alt='logo'/></Link>
            <Link className='favoritos' to="/favoritos">Carteira</Link>
        </header>
    )
}

export default Header;