import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';

function Navbar({ links = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
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

                        {/* CORRECCIÓN AQUÍ: 
                           1. Usamos <Link> en vez de div.
                           2. Agregamos 'h-full flex items-center' para forzar el centrado vertical siempre.
                        */}
                        <Link to="/" className="flex-shrink-0 flex items-center h-full cursor-pointer text-decoration-none">
                            <h1 className="text-2xl font-bold tracking-wider text-red-600 hover:text-red-500 transition-colors m-0 leading-none flex items-center">
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
                                            isActive 
                                            ? 'text-red-500 border-red-500' 
                                            : 'text-gray-300 border-transparent hover:text-red-500 hover:border-red-500'
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>

                        <div className="md:hidden flex items-center h-full">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-300 hover:text-red-500 focus:outline-none p-2 flex items-center"
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

                {/* Menú Móvil */}
                {isOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-sm border-t border-gray-800">
                        <div className="px-2 pt-2 pb-3 space-y-1 shadow-xl">
                            {links.map((link, i) => (
                                <NavLink
                                    key={i}
                                    to={link.to}
                                    onClick={(e) => handleLinkClick(e, link)}
                                    className={({ isActive }) => `block px-3 py-2 text-base font-medium rounded-md transition-all duration-300 ${isActive ? 'text-red-500 bg-red-900/20' : 'text-gray-300 hover:text-red-500 hover:bg-gray-800'}`} >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Espaciador para que el contenido no se esconda detrás del navbar */}
            <div className="h-16 w-full bg-black"></div>
        </>
    );
}

export default Navbar;