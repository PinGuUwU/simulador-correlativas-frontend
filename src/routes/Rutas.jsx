import React from 'react'
import { useRoutes } from 'react-router-dom'
import Correlativas from '../pages/Correlativas.jsx'
import Equivalencias from '../pages/Equivalencias.jsx'
import ChatBot from '../pages/ChatBot.jsx'

const Rutas = ({ plan }) => {
    const componentesRutas = useRoutes([
        {
            path: "/correlativas",
            element: <Correlativas plan={plan} />
        },
        {
            path: "/equivalencias",
            element: <Equivalencias plan={plan} />,
        },
        {
            path: "/chatbot",
            element: <ChatBot plan={plan} />
        }
    ])
    return componentesRutas
}

export default Rutas