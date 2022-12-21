import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import clienteAxios from '../config/clienteAxios';
import Alerta from '../components/alerta';

const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setcuentaConfirmada] = useState(false);
  const params = useParams();
  const { id } = params;
  

  useEffect(() => {
    const confirmar = async ()=>{
      try {
        //const url = `/usuarios/confirmar/${id}`;
        const {data} = await clienteAxios(`/usuarios/confirmar/${id}`);
        setAlerta({
          msg: data.msg,
          error: false
        })
        setcuentaConfirmada(true)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    confirmar();
  }, []);

  const {msg} = alerta;

  return (
    <>
    <h1 className="text-sky-600 font-black text-3xl">Confirma tu cuenta y comienza a crear tus <span className="text-slate-700">proyectos</span></h1>
   <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white ">
    {msg && <Alerta alerta={alerta}/>} 
    {cuentaConfirmada && (
      <Link
      className='block text-center my-5 text-slate-500 uppercase text-sm'
      to="/"
      >
      Inicia sesión
      </Link>
    )}  
  </div> 
  </>
  )
}

export default ConfirmarCuenta