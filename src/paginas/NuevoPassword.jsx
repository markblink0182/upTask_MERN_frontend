import { useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios.js';
import Alerta from '../components/alerta';

const NuevoPassword = () => {
  const [passwordModificado, setPasswordModificado] = useState(false);
  const [password, setPassword] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [alerta, setAlerta] = useState({});
  const params = useParams();
  const { token } = params;
  useEffect(() => {
    const comprobarPassword = async ()=>{
      try {
        //const {data} = await axios(`http://localhost:4000/api/usuarios/olvide-password/${token}`);
        const {data} = await clienteAxios(`/usuarios/olvide-password/${token}`);
        setTokenValido(true);
      } catch (error) {
        console.log(error.response.data.msg)
        setAlerta({
          msg: error.response.data.msg,
          error: true
        });
        return;
      }
    }
    comprobarPassword();
  }, []);

  const handleSubmit = async e =>{
    e.preventDefault();
    if(password == '' || password.length < 6){
      setAlerta({
        msg: 'Password inválido',
        error: true
      });
      return;
    }

    try {
      const url = `/usuarios/olvide-password/${token}`;
      const { data } = await clienteAxios.post(url, { password });
      setAlerta({
        msg: data.msg,
        error: false
      });
      setPasswordModificado(true); 
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
      <h1 className="text-sky-600 font-black text-3xl">Recupera tu password y no pierdas acceso a tus <span className="text-slate-700">proyectos</span></h1>
      {msg && <Alerta alerta={alerta} />}
      
      { tokenValido && (
        <form 
        onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg px-10 py-5">
        <div className="py-4">
          <label
          className="block uppercase text-gray-800 font-bold text-xl"
          htmlFor="password"
          >Nuevo password</label>
          <input
            type="password"
            id="password"
            placeholder="Escribe tu nuevo password"
            className="w-full mt-3 p-2 border rounded-xl bg-gray-50"
            value={password}
            onChange={e =>setPassword(e.target.value)}
          />
        </div>
        <input 
          type="submit"
          value="Guardar"
          className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
        />
      </form>
      )}

  {passwordModificado && (
      <Link
      className='block text-center my-5 text-slate-500 uppercase text-sm'
      to="/"
      >
      Inicia sesión
      </Link>
    )} 

    </>
  )
}

export default NuevoPassword