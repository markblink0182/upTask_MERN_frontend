import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta';
import clienteAxios from '../config/clienteAxios.js';

const Registrar = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async e=>{
    e.preventDefault();

    if([nombre, email, password, repetirPassword].includes('')){
      setAlerta({
        msg: 'Todos los campos son obligatorios.',
        error: true
      });
      return;
    }

    if(password !== repetirPassword){
      setAlerta({
        msg: 'Los passwords no son iguales.',
        error: true
      });
      return;
    }

    if(password.length < 6){
      setAlerta({
        msg: 'El password debe contener minimo 6 caracteres.',
        error: true
      });
      return;
    }

    setAlerta({});
    /*Crear el usuario via Api*/
    try {
      const { data } = await clienteAxios.post(`/usuarios`, {
        nombre, email, password
      });
      setAlerta({
        msg: data.msg,
        error: false
      })
      setNombre('');
      setEmail('');
      setPassword('');
      setRepetirPassword('');
    } catch (error) {
      setAlerta({
        msg: error.response,
        error: true
      })
    }
  }

  const {msg} = alerta; //Extrar msg del state

  return (
    <>
      <h1 className="text-sky-600 font-black text-3xl">Crea tu cuenta y administra tus <span className="text-slate-700">proyectos</span></h1>
      {msg && <Alerta alerta={ alerta } />} 
      <form 
      onSubmit={handleSubmit}
      className="my-10 bg-white shadow rounded-lg px-10 py-5">
      <div className="py-4">
          <label
          className="block uppercase text-gray-800 font-bold text-xl"
          htmlFor="nombre"
          >Tu nombre</label>
          <input
            type="text"
            id="nombre"
            placeholder="Tu nombre."
            className="w-full mt-3 p-2 border rounded-xl bg-gray-50"
            value={nombre}
            onChange={e =>setNombre(e.target.value)}
          />
        </div>
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
            onChange={e=>setEmail(e.target.value)}
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
            onChange={e=>setPassword(e.target.value)}
          />
        </div>
        <div className="py-4">
          <label
          className="block uppercase text-gray-800 font-bold text-xl"
          htmlFor="password2"
          >Confirma tu password.</label>
          <input
            type="password"
            id="password2"
            placeholder="Repite tu password"
            className="w-full mt-3 p-2 border rounded-xl bg-gray-50"
            value={repetirPassword}
            onChange={e=>setRepetirPassword(e.target.value)}
          />
        </div>
        <input 
          type="submit"
          value="Crer cuenta"
          className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
        />
      </form>

      <nav className='lg:flex lg:justify-between'>
        <Link
          to='/'
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          >
          ¿Ya tienes una cuenta? Inicia sesión.
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

export default Registrar