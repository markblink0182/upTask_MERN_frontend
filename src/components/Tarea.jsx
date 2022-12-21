import React from 'react'
import useProyectos from '../hooks/useProyectos.jsx';
import { formatearFecha } from '../helpers/formatearFecha.js'
import useAdmin from '../hooks/useAdmin';
const Tarea = ({tarea}) => {
    const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } =useProyectos();
    const { descripcion, nombre, prioridad, fechaEntrega, _id, estado} = tarea;
    const admin = useAdmin();

  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div className='flex flex-col items-start'>
           <p className="mb-2 text-xl">{ nombre }</p>
           <p className="mb-2 text-sm text-gray-500 uppercase">{ descripcion }</p> 
           <p className="mb-2 text-sm">{ formatearFecha(fechaEntrega) }</p> 
           <p className="mb-2 text-gray-600">Prioridad: { prioridad }</p>
           {estado && <p className="text-sm bg-green-600 uppercase p-1 rounded-lg text-white">Completado por: {tarea.completado.nombre}</p>}
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
            {admin && (
                <button 
                onClick={()=> handleModalEditarTarea(tarea) }
                className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">
                    Editar
                </button>
            )}
            <button
                onClick={()=>completarTarea(_id)}
                className={`${estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
                >
                { estado ? 'Completa' : 'Incompleta'}
            </button>

            {admin && (
                <button
                onClick={()=>handleModalEliminarTarea(tarea)}
                className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">
                    Eliminar
                </button>
            )}
            
        </div>
    </div>
  )
}

export default Tarea