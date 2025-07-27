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
  menuItems: [
    { type: "title", title: "Administración" },
    { type: "collapse", title: "Dashboard", icon: "dashboard", path: "/dashboard" },
    { type: "collapse", title: "Usuarios", icon: "people", path: "/users" },
    { type: "collapse", title: "Productos", icon: "inventory", path: "/products" },
    { type: "collapse", title: "Carga Masiva", icon: "upload", path: "/bulk-upload" }
  ]
};

// Datos simulados para el rol de vendedor
const sellerMockData = {
  userData: {
    id: 2,
    name: "Vendedor",
    email: "seller@saluda.com",
    avatar: "https://ui-avatars.com/api/?name=Vendedor&background=4CAF50&color=fff",
    role: "seller",
    fk_sucursal: 1,
    permissions: ["sales", "inventory"]
  },
  dashboardData: {
    stats: [
      { title: "Ventas Hoy", value: "$8,234", icon: "payment", color: "primary" },
      { title: "Productos Vendidos", value: "45", icon: "inventory", color: "success" },
      { title: "Clientes Atendidos", value: "12", icon: "people", color: "info" },
      { title: "Meta Mensual", value: "85%", icon: "trending_up", color: "warning" }
    ]
  },
  menuItems: [
    { type: "title", title: "Ventas" },
    { type: "collapse", title: "POS", icon: "point_of_sale", path: "/pos" },
    { type: "collapse", title: "Productos", icon: "inventory", path: "/products" },
    { type: "collapse", title: "Clientes", icon: "people", path: "/customers" }
  ]
};

// Datos simulados para el rol de enfermera
const nurseMockData = {
  userData: {
    id: 3,
    name: "Enfermera",
    email: "nurse@saluda.com",
    avatar: "https://ui-avatars.com/api/?name=Enfermera&background=FF9800&color=fff",
    role: "nurse",
    fk_sucursal: 1,
    permissions: ["patients", "appointments"]
  },
  dashboardData: {
    stats: [
      { title: "Pacientes Hoy", value: "18", icon: "people", color: "primary" },
      { title: "Citas Pendientes", value: "6", icon: "event", color: "warning" },
      { title: "Signos Vitales", value: "12", icon: "favorite", color: "success" },
      { title: "Reportes", value: "3", icon: "description", color: "info" }
    ]
  },
  menuItems: [
    { type: "title", title: "Pacientes" },
    { type: "collapse", title: "Pacientes", icon: "people", path: "/patients" },
    { type: "collapse", title: "Citas", icon: "event", path: "/appointments" },
    { type: "collapse", title: "Signos Vitales", icon: "favorite", path: "/vitals" }
  ]
};

// Datos simulados para el rol de doctor
const doctorMockData = {
  userData: {
    id: 4,
    name: "Doctor",
    email: "doctor@saluda.com",
    avatar: "https://ui-avatars.com/api/?name=Doctor&background=2196F3&color=fff",
    role: "doctor",
    fk_sucursal: 1,
    permissions: ["patients", "diagnosis", "prescriptions"]
  },
  dashboardData: {
    stats: [
      { title: "Consultas Hoy", value: "8", icon: "medical_services", color: "primary" },
      { title: "Pacientes Pendientes", value: "4", icon: "people", color: "warning" },
      { title: "Recetas Emitidas", value: "6", icon: "receipt", color: "success" },
      { title: "Diagnósticos", value: "5", icon: "description", color: "info" }
    ]
  },
  menuItems: [
    { type: "title", title: "Consultas" },
    { type: "collapse", title: "Pacientes", icon: "people", path: "/patients" },
    { type: "collapse", title: "Consultas", icon: "medical_services", path: "/consultations" },
    { type: "collapse", title: "Recetas", icon: "receipt", path: "/prescriptions" }
  ]
};

// Datos simulados para el rol de farmacéutico
const pharmacistMockData = {
  userData: {
    id: 5,
    name: "Farmacéutico",
    email: "pharmacist@saluda.com",
    avatar: "https://ui-avatars.com/api/?name=Farmacéutico&background=9C27B0&color=fff",
    role: "pharmacist",
    fk_sucursal: 1,
    permissions: ["inventory", "prescriptions"]
  },
  dashboardData: {
    stats: [
      { title: "Medicamentos Dispensados", value: "23", icon: "medication", color: "primary" },
      { title: "Recetas Procesadas", value: "15", icon: "receipt", color: "success" },
      { title: "Stock Bajo", value: "7", icon: "warning", color: "warning" },
      { title: "Ventas Farmacia", value: "$3,450", icon: "payment", color: "info" }
    ]
  },
  menuItems: [
    { type: "title", title: "Farmacia" },
    { type: "collapse", title: "Inventario", icon: "inventory", path: "/inventory" },
    { type: "collapse", title: "Recetas", icon: "receipt", path: "/prescriptions" },
    { type: "collapse", title: "Medicamentos", icon: "medication", path: "/medications" }
  ]
};

/**
 * Obtiene datos simulados basados en el rol del usuario
 * @param {string} role - Rol del usuario (admin, seller, nurse, doctor, pharmacist)
 * @returns {Object} Datos simulados para el rol especificado
 */
export const getMockDataByRole = (role) => {
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