import React, { useState, useEffect } from 'react';
import { useAuth } from '../context';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

const TotalEmpleadosCount = () => {
    const [totalEmpleados, setTotalEmpleados] = useState(0);
    const { userData } = useAuth();

    // Función para obtener el conteo total
    const fetchTotalCount = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('/api/personal/active/count', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Datos del count total:', data);
                setTotalEmpleados(data.debug?.total_empleados_licencia || 0);
            } else {
                console.error('Error en la respuesta:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error al obtener conteo total de empleados:', error);
        }
    };

    useEffect(() => {
        if (!userData) {
            console.log('TotalEmpleadosCount: No hay userData disponible');
            return;
        }
        console.log('TotalEmpleadosCount: Iniciando fetchTotalCount');
        fetchTotalCount();
    }, [userData]);

    return (
        <MDBox mb={1.5}>
            <ComplexStatisticsCard
                color="dark"
                icon="groups"
                title="Total Empleados"
                count={totalEmpleados}
                percentage={{
                    color: "info",
                    amount: "en la empresa",
                    label: "incluyendo inactivos",
                }}
            />
        </MDBox>
    );
};

export default TotalEmpleadosCount; 