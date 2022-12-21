import { useState, useEffect, createContext } from 'react';
import clienteAxios from '../config/clienteAxios';
import { useNavigate  } from 'react-router-dom'

const AuthContext = createContext();

const AuthProvider = ({children})=>{
    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const autenticarUsuario = async ()=>{
        const token = localStorage.getItem('token');
        /*Evitar que se quede el texto cargando.... */
        if(!token){
            setCargando(false);
            return;
        }
        /*Evitar que se quede el texto cargando.... */

        const config = {
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }

            try {
                const { data } = await clienteAxios('/usuarios/perfil', config);
                setAuth(data);
               // navigate('/proyectos')
            } catch (error) {
                setAuth({})
            } finally {
                setCargando(false);
            }
            

        }
        autenticarUsuario();
    }, []);/*Se pone [] porque solo se va ejecutar 1 vez */

    const cerrarSesionAuth = () =>{
        setAuth({});
    } 
    return (
        <AuthContext.Provider
            value={{
                auth,
                cargando,
                setAuth,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}
export default AuthContext;