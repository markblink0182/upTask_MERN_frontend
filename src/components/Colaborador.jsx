import React from 'react'
import useProyectos from '../hooks/useProyectos';
const Colaborador = ({colaborador}) => {
    const { modalEliminarColaborador, handleModalEliminarColaborador} = useProyectos();
    const { nombre, email } = colaborador;
  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div>
            <p className='text-sm text-gray-700 font-bold'>{nombre}</p>
            <p >{email}</p>
        </div>
        <div>
        <button
            onClick={()=>handleModalEliminarColaborador(colaborador)}
            type="button"
            className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-md"
            >
                Eliminar
            </button>
        </div>
    </div>
  )
}

export default Colaborador