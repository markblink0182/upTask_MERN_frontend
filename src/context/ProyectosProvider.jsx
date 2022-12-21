import { useState, useEffect, createContext } from 'react';
import useAuth from '../hooks/useAuth'; //554. Solucionar Carga de Proyectos al iniciar sesión
import clienteAxios from '../config/clienteAxios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
let socket;


const ProyectoContext = createContext();

const ProyectosProvider = ({children})=>{
const [proyectos, setProyectos] = useState([]);
const [alerta, setAlerta] = useState({});
const [proyecto, setProyecto] = useState({}); /*Colocar el proyecto en el state */
const [cargando, setCargando] = useState(false); /*Evitar flaseo */
const [modalFormularioTarea, setModalFormularioTarea] = useState(false);/*Modal */
const [tarea, setTarea] = useState({});/* Identificar la tarea a editar*/
const [modalEliminarTarea, setModalEliminarTarea] = useState(false);/*Modal para eliminar tarea */
const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);/*Modal para eliminar colaborador */
const [colaborador, setColaborador ] = useState({});/*Modal para eliminar colaborador */
const [buscador, setBuscador ] = useState(false);/*Modal para buscar proyecto */

const { auth } = useAuth();//554. Solucionar Carga de Proyectos al iniciar sesión

const navigate = useNavigate() /* Para usar redireccionamiento */

/* Recuperar los proyectos de un usuario*/
useEffect(() => {
    const obtenerProyectos = async () =>{
        setCargando(true)/*Evitar flaseo*/
        try {
            const token = localStorage.getItem('token');
            if(!token) return;

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios('/proyectos', config);
            setProyectos(data); /* Pasar al state */
        } catch (error) {
            console.log(error)
        }finally{
            setCargando(false)
        }
    }
    obtenerProyectos();
}, [auth]);

/* Socket IO connection*/
useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
}, []);



const mostrarAlerta = alerta =>{
    setAlerta(alerta);

    setTimeout(() => {
        setAlerta({})
    }, 3000);
}

const submitProyecto = async proyecto =>{
    if(proyecto.id){ /*Actualizar, ya que trae el ID */
        await editarProyecto(proyecto)
    }else{
       await nuevoProyecto(proyecto)
    }
}

    const editarProyecto = async(proyecto)=>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
    
            const config = {
                headers:{
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config);
            
            //Sincronizar el state
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id?data:proyectoState);
            setProyectos(proyectosActualizados);
            //Mostrar alerta
            setAlerta({
                msg: 'Proyecto actualizado exitosamente.',
                error: false
            });

            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos');
            }, 3000);

            //redireccionar
            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos');
            }, 3000);
    
        } catch (error) {
            console.log(error)
        }
    }

    const nuevoProyecto = async (proyecto)=>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
    
            const config = {
                headers:{
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos', proyecto, config);
            setAlerta({
                msg: 'Proyecto creado exitosamente.',
                error: false
            });
            setProyectos([...proyectos, data]); /* Pasar al state */

            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos');
            }, 3000);
    
        } catch (error) {
            console.log(error)
        }
    }

    const obtenerProyecto = async id=>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios(`/proyectos/${id}`, config);
            setProyecto(data)/* Colocar el proyecto en el state */
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos');
            }, 3000);
        }finally{
            setCargando(false)
        }
    }

    const eliminarProyecto = async (id)=>{
        try {
            const token =localStorage.getItem('token');
            if(!token) return;

            const config = {
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);
            /* Sincronizar el state */
            const proyectosActualizados = proyectos.filter(proyectoState=>proyectoState._id !== id);
            setProyectos(proyectosActualizados);

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos');
            }, 3000);

        } catch (error) {
            console.log(error)
        }
    }

    /*Modal */
    const handleModalTarea = ()=>{
        setModalFormularioTarea(!modalFormularioTarea);
        setTarea({}) /* Limpiar las cajas de texto cuando se agregue una nueva tarea */
    }

    /* Funcion para crear/actualizar la tarea */
    const submitTarea = async tarea =>{
        /*Actualizar tarea */
        if(tarea?.id){
            await editarTarea(tarea);
        }else{
            await crearTarea(tarea);
        }

        
    }

    const crearTarea = async tarea =>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/tareas', tarea, config);
            /* 489. Añadir las Tareas al State , se muda a soketIO*/
            setAlerta({})
            setModalFormularioTarea(false);
             /* Socket IO */
             socket.emit('nueva tarea', data);
        } catch (error) {
            console.log(error)
        }
    }

    const editarTarea = async tarea =>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config);
            setAlerta({});
            setModalFormularioTarea(false);
            /* 489. Añadir las Tareas al State */
            /* const proyectoActualizado = {...proyecto}//Tomar una copia del proyecto que esta en el state
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id ===data._id ? data: tareaState)
            setProyecto(proyectoActualizado); */
             socket.emit('actualizar tarea', data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalEditarTarea = tarea=>{
        setTarea(tarea);
        setModalFormularioTarea(true);
    }

    /* Modal Eliminar Tarea */
    const handleModalEliminarTarea = tarea =>{
        setTarea(tarea);
        setModalEliminarTarea(!modalEliminarTarea);
    }

    /* Modal Eliminar Colaborador */
    const handleModalEliminarColaborador = colaborador =>{
        setColaborador(colaborador);
        setModalEliminarColaborador(!modalEliminarColaborador);
    }

    const eliminarTarea = async ()=>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config);
            setAlerta({
                msg: data.msg,
                error: false
            });

            /* const proyectoActualizado = {...proyecto}//Tomar una copia del proyecto que esta en el state
            proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id);
            setProyecto(proyectoActualizado); SE MUDA A SOCKET IO*/
            setModalEliminarTarea(false);
            
            /*Socket IO */
            socket.emit('eliminar tarea', tarea);
            setTarea({});
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    const eliminarColaborador = async ()=>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config);

            /*Actualizar el state */
            const proyectoActualizado = {...proyecto};
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradoresState=>colaboradoresState._id !== colaborador._id);
            setProyecto(proyectoActualizado);

            setAlerta({
                msg: data.msg,
                error: false
            });
            setColaborador({});
            setModalEliminarColaborador(false)
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
            
            setColaborador({});
        }finally{
            setCargando(false);
      
        }
    }

    const submitColaborador = async (email) => {
        setCargando(true);
        try {
            const token = localStorage.getItem('token');
            if(!token) return;

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores`, {email}, config);
            setColaborador(data);
            setAlerta({})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
            
            setColaborador({});
        }finally{
            setCargando(false);
      
        }
    }

    const agregarColaborador = async (email)=>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config);
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
        }
    }

    const completarTarea = async (id) =>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config);
            /* const proyectoActualizado = {...proyecto };
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState=> tareaState._id === data._id ? data : tareaState);
            setProyecto(proyectoActualizado); */
            socket.emit('cambiar estado', data);
            setTarea({});
            setAlerta({});
           /*  setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
            }, 3000); */
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
        }
    }

    const handleBuscador = ()=>{
        console.log(buscador)
        setBuscador(!buscador) 
    }

    /*Socket io */
    const submitTareasProyecto = (tarea) =>{
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
        setProyecto(proyectoActualizado); 
    }

    const eliminarTareaProyecto = (tarea)=>{
        const proyectoActualizado = {...proyecto}//Tomar una copia del proyecto que esta en el state
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id);
        setProyecto(proyectoActualizado);
    }

    const actualizarTareaProyecto = (tarea)=>{
            const proyectoActualizado = {...proyecto}//Tomar una copia del proyecto que esta en el state
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id ===tarea._id ? tarea: tareaState)
            setProyecto(proyectoActualizado);
    }

    const cambiarEstadoTarea = (tarea)=>{
        const proyectoActualizado = {...proyecto };
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState=> tareaState._id === tarea._id ? tarea : tareaState);
        setProyecto(proyectoActualizado);
    }

    const cerrarSesionProyecto = () => {
        setProyectos([]);
        setProyecto({});
        setAlerta({});
    }

    return (
        <ProyectoContext.Provider value={{
            proyectos,
            proyecto,
            alerta,
            cargando,
            modalFormularioTarea,
            modalEliminarTarea,
            modalEliminarColaborador,
            tarea,
            colaborador,
            buscador,
            handleModalTarea,
            mostrarAlerta,
            submitProyecto,
            obtenerProyecto,
            eliminarProyecto,
            submitTarea,
            handleModalEditarTarea,
            handleModalEliminarTarea,
            handleModalEliminarColaborador,
            eliminarTarea,
            submitColaborador,
            agregarColaborador,
            eliminarColaborador,
            completarTarea,
            handleBuscador,
            submitTareasProyecto,
            eliminarTareaProyecto,
            actualizarTareaProyecto,
            cambiarEstadoTarea,
            cerrarSesionProyecto
        }}>
            {children}
        </ProyectoContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectoContext;