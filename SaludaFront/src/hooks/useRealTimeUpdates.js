import { useState, useEffect } from 'react';
import { useAuth } from '../context';

export const useRealTimeUpdates = () => {
    const [personalActivo, setPersonalActivo] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const { userData } = useAuth();

    useEffect(() => {
        if (!userData || !window.Echo) return;

        const licencia = userData.Id_Licencia || userData.ID_H_O_D;
        if (!licencia) return;

        // Suscribirse al canal privado
        const channel = window.Echo.private(`personal.licencia.${licencia}`);
        
        setIsConnected(true);

        // Escuchar el evento de actualización
        channel.listen('PersonalUpdated', (e) => {
            console.log('🔄 Actualización en tiempo real recibida:', e);
            setPersonalActivo(e.active);
            
            // Mostrar notificación
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Personal Actualizado', {
                    body: `Se actualizó el conteo de personal activo: ${e.active} empleados`,
                    icon: '/favicon.ico'
                });
            }
        });

        // Limpiar al desmontar
        return () => {
            channel.stopListening('PersonalUpdated');
            setIsConnected(false);
        };
    }, [userData]);

    return {
        personalActivo,
        isConnected,
        licencia: userData?.Id_Licencia || userData?.ID_H_O_D
    };
}; 