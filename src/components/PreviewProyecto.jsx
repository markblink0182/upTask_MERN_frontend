import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom'

const PreviewProyecto = ({proyecto}) => {
    const { auth } = useAuth();
    const { nombre, _id, cliente, creador } = proyecto;

  return (
    <div className="border-b p-5 flex justify-between flex-col md:flex-row">
      <div className='flex items-center gap-2'>
      <p className="flex-1">
            {nombre}
            <span className="text-sm text-gray-600 uppercase font-bold">{''}{cliente}</span>
        </p>
        {auth._id !== proyecto.creador && (
          <p className="p-1 text-xs rounded-lg text-white bg-green-600 font-bold uppercase">
            Colaborador
          </p>
        )}
      </div>
        <Link
         to={`${_id}`}
         className="text-gray-600 hover:text-gray-800 uppercase text-sm font-bold"
         >Ver proyecto</Link>
    </div>
  )
}

export default PreviewProyecto