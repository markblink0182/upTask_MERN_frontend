import { Link } from "react-router-dom";
import { useState } from "react";
import Alerta from "../components/alerta";
import clienteAxios from "../config/clienteAxios.js";

const OlvidePassword = () => {
  const [email, setEmail] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(email)
    if(email == ''){
      setAlerta({
        msg: 'El email es obligatorio',
        error: true
      });
      return;
    }

    try {
     // const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/olvide-password`,{email});
      const {data} = await clienteAxios.post(`/usuarios/olvide-password`, {email});
      console.log(data)
      setAlerta({
        msg: data.msg,
        error: false
      })
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      });
      return;
      console.log(error.response)
    }
  }

  const {msg} = alerta;
  return (
    <>
      <h1 className="text-sky-600 font-black text-3xl">Recupera tu acceso y no pierdas tus <span className="text-slate-700">proyectos</span></h1>
      {msg && <Alerta alerta={alerta} />}
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
            onChange={e=>setEmail(e.target.value)}
          />
        </div>
        <input 
          type="submit"
          value="Enviar instrucciones"
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
          to='/registrar'
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          >
           ¿No tienes una cuenta? Registrate.
        </Link>
      </nav>
    </>
  )
}

export default OlvidePassword