import Alerta from '../components/alerta';
import clienteAxios from '../config/clienteAxios';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth'; /*Importar hook */

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setEPassword] = useState('');
  const [alerta, setAlerta] = useState({});
  const { setAuth, auth, cargando } = useAuth();

  /* Navigate */
  const navigate = useNavigate();

  const handleSubmit = async e =>{
    e.preventDefault();
    if([email,password].includes('')){
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return;
    }

    try {
      const { data } = await clienteAxios.post('/usuarios/login', {email, password});
      setAlerta({})//Limpiar alerta
      localStorage.setItem('token', data.token);
      setAuth(data)
      navigate('/proyectos')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }
  const { msg } = alerta;
  return (
    <>
      <h1 className="text-sky-600 font-black text-3xl">Inicia sesión y administra tus <span className="text-slate-700">proyectos</span></h1>
      {msg && <Alerta alerta={alerta}/>}
      <form 
      onSubmit={handleSubmit}
      className="my-10 bg-white shadow rounded-lg px-10 py-5">
        <div className="py-4">
          <label
          className="block uppercase text-gray-800 font-bold text-xl"
          htmlFor="email"
          >Email</label>
          <input
            type="email"
            id="email"
            placeholder="Escribe tu email de registro"
            className="w-full mt-3 p-2 border rounded-xl bg-gray-50"
            value={email}
            onChange={e =>setEmail(e.target.value)}
          />
        </div>
        <div className="py-4">
          <label
          className="block uppercase text-gray-800 font-bold text-xl"
          htmlFor="password"
          >Password</label>
          <input
            type="password"
            id="password"
            placeholder="Escribe tu password"
            className="w-full mt-3 p-2 border rounded-xl bg-gray-50"
            value={password}
            onChange={e => setEPassword(e.target.value)}
          />
        </div>
        <input 
          type="submit"
          value="Iniciar sesión"
          className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
        />
      </form>

      <nav className='lg:flex lg:justify-between'>
        <Link
          to='/registrar'
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          >
          ¿No tienes una cuenta? Regístrate
        </Link>
        <Link
          to='/olvide-password'
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          >
          Olvidé mi password.
        </Link>
      </nav>
    </>
  )
}

export default Login