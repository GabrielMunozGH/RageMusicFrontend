import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">

            <div className="relative h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-blue-900 overflow-hidden">
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                        RAGE MUSIC
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        La colección de discos más potente de la web.
                    </p>
                    
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link to="/productos" className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-8 rounded-full transition transform hover:scale-105 shadow-lg">
                            Ver Catálogo
                        </Link>
                        <Link to="/auth/login" className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-4 px-8 rounded-full transition transform hover:scale-105">
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </div>


            <div className="py-20 px-8 bg-gray-800">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="p-6 border border-gray-700 rounded-lg">
                        <h3 className="text-2xl font-bold mb-2 text-blue-400">Envíos Rápidos</h3>
                        <p className="text-gray-400">Tus discos llegan a tiempo.</p>
                    </div>
                    <div className="p-6 border border-gray-700 rounded-lg">
                        <h3 className="text-2xl font-bold mb-2 text-blue-400">Calidad Premium</h3>
                        <p className="text-gray-400">Solo vinilos y CDs originales.</p>
                    </div>
                    <div className="p-6 border border-gray-700 rounded-lg">
                        <h3 className="text-2xl font-bold mb-2 text-blue-400">Compra Segura</h3>
                        <p className="text-gray-400">Tus datos están protegidos.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;