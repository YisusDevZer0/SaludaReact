/**
 * Servicio para simular datos de diferentes roles de usuario
 * Este archivo proporciona datos ficticios para cada rol en la aplicación
 * mientras no se conecta con una base de datos real
 */

// Datos simulados para el rol de administrador
const adminMockData = {
  userData: {
    id: 1,
    name: "Admin Principal",
    email: "admin@saluda.com",
    avatar: "https://ui-avatars.com/api/?name=Admin+Principal&background=0D8ABC&color=fff",
    role: "admin",
    fk_sucursal: 1,
    permissions: ["all"]
  },
  dashboardData: {
    stats: [
      { title: "Ventas Hoy", value: "$12,345", icon: "payment", color: "primary" },
      { title: "Citas Programadas", value: "24", icon: "event", color: "success" },
      { title: "Servicios Pendientes", value: "8", icon: "list_alt", color: "warning" },
      { title: "Personal Activo", value: "15", icon: "group", color: "info" }
    ],
    recentTransactions: [
      { id: 1, client: "Juan Pérez", service: "Consulta General", amount: "$350", date: "2023-05-15" },
      { id: 2, client: "María González", service: "Laboratorio", amount: "$1,200", date: "2023-05-15" },
      { id: 3, client: "Roberto Sánchez", service: "Rayos X", amount: "$800", date: "2023-05-14" },
      { id: 4, client: "Lucía Martínez", service: "Farmacia", amount: "$450", date: "2023-05-14" },
      { id: 5, client: "Carlos Torres", service: "Consulta Pediátrica", amount: "$400", date: "2023-05-13" }
    ],
    inventoryAlerts: [
      { id: 1, product: "Paracetamol 500mg", stock: 5, minStock: 10, status: "critical" },
      { id: 2, product: "Jeringas Desechables", stock: 15, minStock: 20, status: "warning" },
      { id: 3, product: "Guantes Quirúrgicos", stock: 25, minStock: 30, status: "warning" }
    ],
    appointmentsToday: [
      { id: 1, patient: "Laura Jiménez", doctor: "Dr. Ramírez", time: "09:00", status: "Confirmada" },
      { id: 2, patient: "Fernando López", doctor: "Dra. Gutiérrez", time: "10:30", status: "En Espera" },
      { id: 3, patient: "Gabriela Mora", doctor: "Dr. Vega", time: "11:45", status: "Confirmada" },
      { id: 4, patient: "Héctor Díaz", doctor: "Dr. Ramírez", time: "13:15", status: "Cancelada" }
    ],
    monthlySales: [
      { month: "Ene", amount: 8500 },
      { month: "Feb", amount: 9200 },
      { month: "Mar", amount: 10500 },
      { month: "Abr", amount: 9800 },
      { month: "May", amount: 11200 },
      { month: "Jun", amount: 10800 }
    ]
  },
 
};


/**
 * Obtiene datos simulados basados en el rol del usuario
 * @param {string} role - Rol del usuario (admin, seller, nurse, doctor, pharmacist)
 * @returns {Object} Datos simulados para el rol especificado
 */
const getMockDataByRole = (role) => {
  switch (role) {
    case "admin":
      return adminMockData;
    case "seller":
      return sellerMockData;
    case "nurse":
      return nurseMockData;
    case "doctor":
      return doctorMockData;
    case "pharmacist":
      return pharmacistMockData;
    default:
      return adminMockData; // Por defecto, devolver datos de administrador
  }
};

export { 
  getMockDataByRole, 

}; 