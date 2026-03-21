
import { useEffect, useRef, useState } from 'react';
import MateriasList from '../components/Correlativas/MateriasList.jsx';
import MateriasProgreso from '../components/Correlativas/MateriasProgreso.jsx';
import ProgresoTotal from '../components/Correlativas/ProgresoTotal.jsx';
import { Spinner } from '@heroui/react';
import { fetchWithFallback } from '../utils/fetchUtils';


function Correlativas({ plan }) {
    //Estados para guardar las materias y para mostrar una imagen de cargando, además para contabilizar el progreso
    const [materias, setMaterias] = useState([])
    const [progreso, setProgreso] = useState([])
    const [cargando, setCargando] = useState(true)
    const estadosPosibles = ['Disponible', 'Regular', 'Aprobado']
    //Simulo la carrera, en el futuro debo hacer el fetch de plan en el Correlativas y  de ahi pasar todo
    const carrera = "Licenciatura en Sistemas de Información"
    const headerRef = useRef(null)
    //El sticky del progreso total
    const [isSticky, setIsSticky] = useState(false)
    //Busca las materias desde la base de datos, en base al plan seleccionado
    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                //Hago la petición al backend con el nuevo utility con fallback
                const response = await fetchWithFallback(`${plan}`)
                if (!response) {
                    throw new Error("Error en la respuesta del servidor")
                }

                const data = await response.json()
                setMaterias(data)

                //Inicializo acá mismo el progreso
                const progresoInicial = {}
                data.forEach(m => {
                    progresoInicial[m.codigo] = (m.correlativas.length > 0 ? 'Bloqueado' : estadosPosibles[0])
                })
                setProgreso(progresoInicial)


                //Ya no está cargando porque ya tenemos la data
                setCargando(false)
            } catch (error) {
                console.error("Error al traer las materias:", error)
                setCargando(false)
            }
        }
        fetchMaterias()
    }, [plan])//Array vacío para que se ejecute una única vez

    //Calcular el progreso total para pasarselo al componente
    const totalProgreso = () => {
        let total = 0
        materias.forEach((m) => {
            if (progreso[m.codigo] === estadosPosibles[2]) {
                total += 1
            }
        })
        return total
    }
    const progress = Math.round((totalProgreso() * 100) / materias.length)
    return (
        <div className="overflow-hidden bg-gray-100">
            {cargando && (
                <div className='flex justify-center items-center h-screen'>
                    < Spinner />
                </div>
            )}
            {!cargando && (
                <div>
                    <ProgresoTotal
                        carrera={carrera}
                        progress={progress}
                        progreso={progreso}
                        materias={materias}
                        isSticky={isSticky}
                        headerRef={headerRef}
                        setIsSticky={setIsSticky}
                    />
                    <div className='mx-5 md:mx-10 lg:mx-15'>
                        <MateriasProgreso progreso={progreso} materias={materias} />
                        <MateriasList
                            progreso={progreso}
                            setProgreso={setProgreso}
                            materias={materias}
                            cargando={cargando}
                            isProgressSticky={isSticky}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Correlativas;