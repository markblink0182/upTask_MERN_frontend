import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom' /*469. Llenando el Formulario con la Información del Proyecto*/
import useProyectos from '../hooks/useProyectos'; /*Mostrar Alerta 1*/
import Alerta from './alerta'; /*Mostrar Alerta 2*/

const FormularioProyecto = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [cliente, setCliente] = useState('');
    const [id, setId] = useState(null); /*Manejar el ID */

    const params = useParams();/*469. Llenando el Formulario con la Información del Proyecto*/
    const { alerta, mostrarAlerta, submitProyecto, proyecto} = useProyectos(); /*Mostrar Alerta 3, se extrae el proyecto para llenar las cajas de texto al editar*/

    useEffect(() => {
        if(params.id){
            setId(proyecto._id)
            setNombre(proyecto.nombre)
            setDescripcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
        }
    }, [params]);

    const handleSubmit = async e =>{
        e.preventDefault();
        if([nombre, descripcion, fechaEntrega, cliente].includes('')){
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return;
        }
        //Pasar los datos hacia el provider
       await submitProyecto({ nombre, descripcion, fechaEntrega, cliente, id });

       /* Despues de enviar los datos, resetear el formulario */
       setId(null)
       setNombre('');
       setDescripcion('');
       setFechaEntrega('');
       setCliente('');
    }
    const { msg } = alerta; /*Mostrar Alerta 4*/
  return (
    <form
        onSubmit={handleSubmit}
        className="bg-white py-10 px-5 rounded-lg shadow">
            {msg && <Alerta alerta={alerta} />}
        <div className="mb-5">
            <label
            className="text-gray-700 uppercase font-bold text-sm"
            htmlFor='nombre'
            >
                Nombre Proyecto
            </label>
            <input
                id="nombre"
                type="text"
                className="border w-full p-2 mt-2 placeholder-gray-700 rounded-md"
                placeholder='Nombre del proyecto'
                value={nombre}
                onChange={e=>setNombre(e.target.value)}
            />
        </div>
        <div className="mb-5">
            <label
            className="text-gray-700 uppercase font-bold text-sm"
            htmlFor='descripcion'
            >
                Descripcion
            </label>
            <textarea
                id="descripcion"
                className="border w-full p-2 mt-2 placeholder-gray-700 rounded-md"
                placeholder='Descripcion del proyecto'
                value={descripcion}
                onChange={e=>setDescripcion(e.target.value)}
            />
        </div>
        <div className="mb-5">
            <label
            className="text-gray-700 uppercase font-bold text-sm"
            htmlFor='fecha-entrega'
            >
                Fecha Entrega
            </label>
            <input
                id="fecha-entrega"
                className="border w-full p-2 mt-2 placeholder-gray-700 rounded-md"
                type= 'date'
                value={fechaEntrega}
                onChange={e=>setFechaEntrega(e.target.value)}
            />
        </div>
        <div className="mb-5">
            <label
            className="text-gray-700 uppercase font-bold text-sm"
            htmlFor='nombre'
            >
                Cliente
            </label>
            <input
                id="cliente"
                type="text"
                className="border w-full p-2 mt-2 placeholder-gray-700 rounded-md"
                placeholder='Nombre del cliente'
                value={cliente}
                onChange={e=>setCliente(e.target.value)}
            />
        </div>
        <input 
            type="submit"
            value={id ? 'Actualizar proyecto': "Crear proyecto"}
            className="bg-sky-700 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-600 transition-colors"
        />
    </form>
    
  )
}

export default FormularioProyecto