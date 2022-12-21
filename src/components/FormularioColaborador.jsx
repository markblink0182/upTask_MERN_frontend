import {useState} from 'react';
import useProyectos from '../hooks/useProyectos';
import Alerta from './alerta';

const FormularioColaborador = () => {
  const [email, setEmail] = useState('');

  const { alerta, mostrarAlerta, submitColaborador } = useProyectos();

  const handleSubmit =async (e)=>{
    e.preventDefault();

    if(email == ''){
      mostrarAlerta({
        msg: 'Favor de introducir un email',
        error: true
    })
    return;
    }

    await submitColaborador(email);
  }

  const { msg } = alerta;
  console.log(msg)
  return (
    <form
    onSubmit={handleSubmit}
    className="bg-white py-10 px-5 rounded-lg shadow md:w-1/2 w-full"
    >
      {msg && <Alerta alerta={alerta} />}
      <div className="mb-5">
            <label
            className="text-gray-700 uppercase font-bold text-sm"
            htmlFor='email'
            >Email colaborador
            </label>
            <input
                id="email"
                className="border w-full p-2 mt-2 placeholder-gray-700 rounded-md"
                placeholder='Email del usuario'
                type= 'email'
                value={email}
                onChange={e=>setEmail(e.target.value)}
            />
        </div>
        <input 
            type="submit"
            value="Buscar colaborador"
            className="bg-sky-700 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-600 transition-colors"
        />
    </form>
  )
}

export default FormularioColaborador