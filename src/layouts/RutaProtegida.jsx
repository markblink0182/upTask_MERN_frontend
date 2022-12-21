import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet, Navigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RutaProtegida = () => {
    const { auth, cargando } = useAuth();
    if(cargando) return 'cargando...'
  return (
    <>
        { auth._id ? (
            <div className="bg-slate-100">
                <Header />
                <div className="md:flex md:min-h-screen">
                    <Sidebar />
                        <main className="flex-1 p-10">{/* flex 1: Ocupa el resto de la pantalla */}
                            <Outlet />
                        </main>
                </div>
            </div>
        ) : <Navigate to='/' /> }
    </>
  )
}

export default RutaProtegida