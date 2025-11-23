import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function Navbar({ links = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    
    const { getCartCount } = useCart(); 
    const cartCount = getCartCount();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        setIsOpen(false);
    };

    const handleLinkClick = (e, link) => {
        if (link.label === 'Salir') {
            e.preventDefault();
            handleLogout();
        } else {
            setIsOpen(false);
        }
    };

    return (
        <> 
            <nav className="fixed top-0 left-0 w-full z-50 bg-black text-white shadow-lg h-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">

                        <Link to="/" className="flex-shrink-0 flex items-center h-full cursor-pointer text-decoration-none group">
                            <h1 className="text-2xl font-bold tracking-wider text-red-600 group-hover:text-red-500 transition-colors m-0 leading-none flex items-center">
                                RageMusic
                            </h1>
                        </Link>

                        <div className="hidden md:flex space-x-8 items-center h-full">
                            {links.map((link, i) => (
                                <NavLink
                                    key={i}
                                    to={link.to}
                                    onClick={(e) => link.label === 'Salir' && handleLinkClick(e, link)}
                                    className={({ isActive }) =>
                                        `flex items-center h-full px-3 text-lg font-medium transition-all duration-300 border-b-2 ${
                                            isActive && link.label !== 'Salir'
                                            ? 'text-red-500 border-red-500' 
                                            : 'text-gray-300 border-transparent hover:text-red-500 hover:border-red-500'
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}

                            <Link to="/carrito" className="relative p-2 text-gray-300 hover:text-red-500 transition-colors flex items-center group">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full shadow-sm animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        <div className="md:hidden flex items-center gap-4 h-full">
                            <Link to="/carrito" className="relative p-2 text-gray-300 hover:text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-300 hover:text-red-500 focus:outline-none p-2 flex items-center transition-colors"
                                aria-label="Abrir menÃº"
                            >
                                {isOpen ? (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-sm border-t border-gray-800 animate-fade-in-down">
                        <div className="px-2 pt-2 pb-3 space-y-1 shadow-xl">
                            {links.map((link, i) => (
                                <NavLink
                                    key={i}
                                    to={link.to}
                                    onClick={(e) => handleLinkClick(e, link)}
                                    className={({ isActive }) => 
                                        `block px-3 py-2 text-base font-medium rounded-md transition-all duration-300 ${
                                            isActive && link.label !== 'Salir'
                                            ? 'text-red-500 bg-red-900/20' 
                                            : 'text-gray-300 hover:text-red-500 hover:bg-gray-800'
                                        }`
                                    } 
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            <div className="h-16 w-full bg-black"></div>
        </>
    );
}

export default Navbar;