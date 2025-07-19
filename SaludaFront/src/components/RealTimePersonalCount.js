import React, { useState, useEffect } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuth } from '../context';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Configurar Laravel Echo
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.REACT_APP_PUSHER_APP_KEY || 'your-pusher-key',
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER || 'mt1',
    encrypted: true,
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                // Obtener el token del localStorage
                const token = localStorage.getItem('access_token');
                
                fetch('/api/broadcasting/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        socket_id: socketId,
                        channel_name: channel.name
                    })
                })
                .then(response => response.json())
                .then(data => {
                    callback(null, data);
                })
                .catch(error => {
                    callback(error);
                });
            }
        };
    }
});

const RealTimePersonalCount = () => {
    const [personalActivo, setPersonalActivo] = useState(0);
    const [totalEmpleados, setTotalEmpleados] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const { userData } = useAuth();

    // Función para obtener el conteo inicial
    const fetchPersonalCount = async () => {
        try {
            const token = localStorage.getItem('access_token');
            console.log('Token disponible:', token ? 'Sí' : 'No');
            console.log('Token (primeros 20 chars):', token ? token.substring(0, 20) + '...' : 'No token');
            
            const response = await fetch('/api/personal/active/count', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Datos del count:', data);
                setPersonalActivo(data.active || 0);
                setTotalEmpleados(data.debug?.total_empleados_licencia || 0);
            } else {
                console.error('Error en la respuesta:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error al obtener conteo de personal:', error);
        }
    };

    useEffect(() => {
        if (!userData) {
            console.log('No hay userData disponible');
            return;
        }

        const licencia = userData.Id_Licencia || userData.ID_H_O_D;
        if (!licencia) {
            console.log('No hay licencia disponible en userData:', userData);
            return;
        }

        console.log('Iniciando fetchPersonalCount con licencia:', licencia);
        // Obtener conteo inicial
        fetchPersonalCount();

        // Suscribirse al canal privado
        const channel = window.Echo.private(`personal.licencia.${licencia}`);
        
        setIsConnected(true);

        // Escuchar el evento de actualización
        channel.listen('PersonalUpdated', (e) => {
            console.log('Evento recibido:', e);
            setPersonalActivo(e.active);
        });

        // Limpiar al desmontar
        return () => {
            channel.stopListening('PersonalUpdated');
            setIsConnected(false);
        };
    }, [userData]);

    return (
        <MDBox mb={1.5}>
            <ComplexStatisticsCard
                color="info"
                icon="person"
                title="Personal Activo"
                count={personalActivo}
                percentage={{
                    color: "success",
                    amount: isConnected ? "Conectado" : "Desconectado",
                    label: "en tiempo real",
                }}
            />
        </MDBox>
    );
};

export default RealTimePersonalCount; 