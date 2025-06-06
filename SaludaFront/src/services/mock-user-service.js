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
    // Principal
    { type: "title", name: "ADMINISTRACIÓN", key: "admin-title" },
    { type: "collapse", name: "Dashboard", key: "dashboard", icon: "dashboard", route: "/dashboard" },
    { type: "collapse", name: "Perfil", key: "profile", icon: "person", route: "/profile" },
    { type: "collapse", name: "Calendario", key: "calendar", icon: "calendar_today", route: "/calendar" },
    
    
    // Ventas y Servicios
    { type: "title", name: "VENTAS Y SERVICIOS", key: "sales-title" },
    { type: "collapse", name: "Punto de Venta", key: "pos", icon: "point_of_sale", route: "/pos" },
    { type: "collapse", name: "Ventas", key: "sales", icon: "shopping_cart", route: "/sales" },
    { type: "collapse", name: "Servicios", key: "services", icon: "medical_services", route: "/services" },
    { type: "collapse", name: "Facturación", key: "billing", icon: "receipt_long", route: "/billing" },
    
    // Inventario
    { type: "title", name: "INVENTARIO", key: "inventory-title" },
    { type: "collapse", name: "Productos", key: "products", icon: "inventory", route: "/products" },
    { type: "collapse", name: "Categorías", key: "categories", icon: "category", route: "/categories" },
    { type: "collapse", name: "Proveedores", key: "suppliers", icon: "local_shipping", route: "/suppliers" },
    { type: "collapse", name: "Compras", key: "purchases", icon: "shopping_bag", route: "/purchases" },
    
    // Pacientes y Citas
    { type: "title", name: "PACIENTES Y CITAS", key: "patients-title" },
    { type: "collapse", name: "Pacientes", key: "patients", icon: "people", route: "/patients" },
    { type: "collapse", name: "Citas", key: "appointments", icon: "event", route: "/appointments" },
    { type: "collapse", name: "Consultorios", key: "rooms", icon: "meeting_room", route: "/rooms" },
    { type: "collapse", name: "Doctores", key: "doctors", icon: "medical_information", route: "/doctors" },
    
    // Administración
    { type: "title", name: "ADMINISTRACIÓN", key: "administration-title" },
    { type: "collapse", name: "Personal", key: "staff", icon: "badge", route: "/staff" },
    { type: "collapse", name: "Sucursales", key: "branches", icon: "store", route: "/branches" },
    { type: "collapse", name: "Reportes", key: "reports", icon: "analytics", route: "/reports" },
    { type: "collapse", name: "Configuración", key: "settings", icon: "settings", route: "/settings" },
  ]
};

// Datos simulados para el rol de vendedor
const sellerMockData = {
  userData: {
    id: 2,
    name: "Vendedor Demo",
    email: "vendedor@saluda.com",
    avatar: "https://ui-avatars.com/api/?name=Vendedor+Demo&background=27AE60&color=fff",
    role: "seller",
    fk_sucursal: 1,
    permissions: ["sales", "inventory_view"]
  },
  dashboardData: {
    stats: [
      { title: "Ventas Hoy", value: "$3,450", icon: "payment", color: "primary" },
      { title: "Ventas del Mes", value: "$45,280", icon: "trending_up", color: "success" },
      { title: "Clientes Atendidos", value: "18", icon: "people", color: "info" },
      { title: "Productos Bajos", value: "5", icon: "warning", color: "warning" }
    ],
    recentTransactions: [
      { id: 1, client: "Juan Pérez", items: 3, amount: "$350", date: "2023-05-15" },
      { id: 2, client: "María González", items: 5, amount: "$1,200", date: "2023-05-15" },
      { id: 3, client: "Roberto Sánchez", items: 2, amount: "$800", date: "2023-05-14" },
      { id: 4, client: "Lucía Martínez", items: 4, amount: "$450", date: "2023-05-14" },
      { id: 5, client: "Carlos Torres", items: 1, amount: "$400", date: "2023-05-13" }
    ],
    inventoryAlerts: [
      { id: 1, product: "Paracetamol 500mg", stock: 5, minStock: 10, status: "critical" },
      { id: 2, product: "Jeringas Desechables", stock: 15, minStock: 20, status: "warning" },
      { id: 3, product: "Guantes Quirúrgicos", stock: 25, minStock: 30, status: "warning" }
    ],
    topSellingProducts: [
      { id: 1, product: "Paracetamol 500mg", sold: 45, amount: "$2,250" },
      { id: 2, product: "Omeprazol 20mg", sold: 32, amount: "$1,920" },
      { id: 3, product: "Loratadina 10mg", sold: 28, amount: "$1,400" },
      { id: 4, product: "Ibuprofeno 400mg", sold: 25, amount: "$1,250" }
    ]
  },
  menuItems: [
    // Principal
    { type: "title", name: "VENTAS", key: "sales-title" },
    { type: "collapse", name: "Dashboard", key: "dashboard", icon: "dashboard", route: "/dashboard" },
    { type: "collapse", name: "Punto de Venta", key: "pos", icon: "point_of_sale", route: "/pos" },
    { type: "collapse", name: "Historial Ventas", key: "sales-history", icon: "history", route: "/sales-history" },
    { type: "collapse", name: "Arqueo de Caja", key: "cash-register", icon: "account_balance_wallet", route: "/cash-register" },
    
    // Productos
    { type: "title", name: "PRODUCTOS", key: "products-title" },
    { type: "collapse", name: "Catálogo", key: "catalog", icon: "inventory_2", route: "/catalog" },
    { type: "collapse", name: "Buscar Producto", key: "search-product", icon: "search", route: "/search-product" },
    { type: "collapse", name: "Productos Bajos", key: "low-stock", icon: "warning", route: "/low-stock" },
    { type: "collapse", name: "Promociones", key: "promotions", icon: "local_offer", route: "/promotions" },
    
    // Clientes
    { type: "title", name: "CLIENTES", key: "customers-title" },
    { type: "collapse", name: "Directorio", key: "customers", icon: "people", route: "/customers" },
    { type: "collapse", name: "Nuevo Cliente", key: "new-customer", icon: "person_add", route: "/new-customer" },
    { type: "collapse", name: "Cuentas por Cobrar", key: "accounts-receivable", icon: "payments", route: "/accounts-receivable" },
    
    // Personal
    { type: "title", name: "PERSONAL", key: "personal-title" },
    { type: "collapse", name: "Mi Perfil", key: "profile", icon: "person", route: "/profile" },
    { type: "collapse", name: "Ayuda", key: "help", icon: "help", route: "/help" }
  ]
};

// Datos simulados para el rol de enfermero
const nurseMockData = {
  userData: {
    id: 3,
    name: "Enfermero Demo",
    email: "enfermero@saluda.com",
    avatar: "https://ui-avatars.com/api/?name=Enfermero+Demo&background=9B59B6&color=fff",
    role: "nurse",
    fk_sucursal: 1,
    permissions: ["appointments", "patients", "vitals"]
  },
  dashboardData: {
    stats: [
      { title: "Citas Hoy", value: "12", icon: "event", color: "primary" },
      { title: "Pacientes En Espera", value: "4", icon: "people", color: "warning" },
      { title: "Consultorios Activos", value: "3", icon: "meeting_room", color: "success" },
      { title: "Pacientes Atendidos", value: "8", icon: "check_circle", color: "info" }
    ],
    appointmentsToday: [
      { id: 1, patient: "Laura Jiménez", doctor: "Dr. Ramírez", time: "09:00", status: "Confirmada", room: "C101" },
      { id: 2, patient: "Fernando López", doctor: "Dra. Gutiérrez", time: "10:30", status: "En Espera", room: "C102" },
      { id: 3, patient: "Gabriela Mora", doctor: "Dr. Vega", time: "11:45", status: "Confirmada", room: "C103" },
      { id: 4, patient: "Héctor Díaz", doctor: "Dr. Ramírez", time: "13:15", status: "Cancelada", room: "C101" },
      { id: 5, patient: "Ana Rodríguez", doctor: "Dra. Gutiérrez", time: "14:30", status: "Confirmada", room: "C102" },
      { id: 6, patient: "Jorge Méndez", doctor: "Dr. Vega", time: "15:45", status: "Confirmada", room: "C103" }
    ],
    patientsInWaiting: [
      { id: 1, patient: "Fernando López", arrivalTime: "10:15", vitalsChecked: false },
      { id: 2, patient: "Gabriela Mora", arrivalTime: "11:30", vitalsChecked: true },
      { id: 3, patient: "Ana Rodríguez", arrivalTime: "14:10", vitalsChecked: false },
      { id: 4, patient: "Jorge Méndez", arrivalTime: "15:25", vitalsChecked: false }
    ],
    recentVitals: [
      { id: 1, patient: "Laura Jiménez", time: "09:05", temperature: "36.5", pressure: "120/80", pulse: "72", weight: "65kg", height: "165cm" },
      { id: 2, patient: "Gabriela Mora", time: "11:40", temperature: "36.8", pressure: "110/70", pulse: "68", weight: "58kg", height: "160cm" }
    ]
  },
  menuItems: [
    // Principal
    { type: "title", name: "GESTIÓN DIARIA", key: "daily-management-title" },
    { type: "collapse", name: "Dashboard", key: "dashboard", icon: "dashboard", route: "/dashboard" },
    { type: "collapse", name: "Agenda del Día", key: "daily-schedule", icon: "today", route: "/daily-schedule" },
    { type: "collapse", name: "Estado Consultorios", key: "rooms-status", icon: "door_sliding", route: "/rooms-status" },
    
    // Pacientes
    { type: "title", name: "PACIENTES", key: "patients-title" },
    { type: "collapse", name: "Lista de Espera", key: "waiting-list", icon: "hourglass_empty", route: "/waiting-list" },
    { type: "collapse", name: "Triage", key: "triage", icon: "priority_high", route: "/triage" },
    { type: "collapse", name: "Signos Vitales", key: "vitals", icon: "favorite", route: "/vitals" },
    { type: "collapse", name: "Historias Clínicas", key: "medical-records", icon: "description", route: "/medical-records" },
    
    // Citas
    { type: "title", name: "CITAS", key: "appointments-title" },
    { type: "collapse", name: "Calendario", key: "appointments", icon: "event", route: "/appointments" },
    { type: "collapse", name: "Nueva Cita", key: "new-appointment", icon: "add_box", route: "/new-appointment" },
    { type: "collapse", name: "Reprogramar", key: "reschedule", icon: "update", route: "/reschedule" },
    
    // Recursos
    { type: "title", name: "RECURSOS", key: "resources-title" },
    { type: "collapse", name: "Material Médico", key: "medical-supplies", icon: "medical_services", route: "/medical-supplies" },
    { type: "collapse", name: "Solicitar Insumos", key: "request-supplies", icon: "playlist_add", route: "/request-supplies" },
    
    // Perfil
    { type: "title", name: "MI PERFIL", key: "my-profile-title" },
    { type: "collapse", name: "Mi Cuenta", key: "profile", icon: "person", route: "/profile" },
    { type: "collapse", name: "Horarios", key: "schedule", icon: "schedule", route: "/schedule" }
  ]
};

// Datos simulados para el rol de doctor
const doctorMockData = {
  userData: {
    id: 4,
    name: "Dr. Ejemplo",
    email: "doctor@saluda.com",
    avatar: "https://ui-avatars.com/api/?name=Dr+Ejemplo&background=4A90E2&color=fff",
    role: "doctor",
    fk_sucursal: 1,
    specialty: "Medicina General",
    permissions: ["patients", "prescriptions", "consultations"]
  },
  dashboardData: {
    stats: [
      { title: "Citas Hoy", value: "8", icon: "event", color: "primary" },
      { title: "Pacientes Atendidos", value: "5", icon: "people", color: "success" },
      { title: "Pendientes", value: "3", icon: "pending_actions", color: "warning" },
      { title: "Hrs. Consultorio", value: "6", icon: "access_time", color: "info" }
    ],
    appointmentsToday: [
      { id: 1, patient: "Laura Jiménez", time: "09:00", status: "Completada", notes: "Seguimiento tratamiento" },
      { id: 2, patient: "Fernando López", time: "10:30", status: "En Curso", notes: "Primera visita" },
      { id: 3, patient: "Gabriela Mora", time: "11:45", status: "Pendiente", notes: "Control mensual" },
      { id: 4, patient: "Héctor Díaz", time: "13:15", status: "Cancelada", notes: "-" },
      { id: 5, patient: "Ana Rodríguez", time: "14:30", status: "Pendiente", notes: "Resultados análisis" }
    ],
    recentPatients: [
      { id: 1, patient: "Laura Jiménez", lastVisit: "Hoy, 09:00", diagnosis: "Hipertensión", status: "Tratamiento" },
      { id: 2, patient: "Carlos Mendoza", lastVisit: "Ayer, 16:15", diagnosis: "Diabetes tipo 2", status: "Seguimiento" },
      { id: 3, patient: "María Sánchez", lastVisit: "15/05/2023", diagnosis: "Migraña", status: "Controlado" }
    ],
    prescriptions: [
      { id: 1, patient: "Laura Jiménez", date: "Hoy, 09:30", medications: 3, status: "Enviada" },
      { id: 2, patient: "Carlos Mendoza", date: "Ayer, 16:45", medications: 2, status: "Dispensada" }
    ]
  },
  menuItems: [
    // Principal
    { type: "title", name: "CONSULTA", key: "consultation-title" },
    { type: "collapse", name: "Dashboard", key: "dashboard", icon: "dashboard", route: "/dashboard" },
    { type: "collapse", name: "Mi Agenda", key: "my-schedule", icon: "event", route: "/my-schedule" },
    { type: "collapse", name: "Paciente Actual", key: "current-patient", icon: "person_search", route: "/current-patient" },
    
    // Pacientes
    { type: "title", name: "PACIENTES", key: "patients-title" },
    { type: "collapse", name: "Mis Pacientes", key: "my-patients", icon: "people", route: "/my-patients" },
    { type: "collapse", name: "Historias Clínicas", key: "clinical-records", icon: "folder_shared", route: "/clinical-records" },
    { type: "collapse", name: "Buscar Paciente", key: "search-patient", icon: "search", route: "/search-patient" },
    
    // Consulta
    { type: "title", name: "CONSULTA MÉDICA", key: "medical-consultation-title" },
    { type: "collapse", name: "Nueva Nota", key: "new-note", icon: "post_add", route: "/new-note" },
    { type: "collapse", name: "Recetas", key: "prescriptions", icon: "receipt", route: "/prescriptions" },
    { type: "collapse", name: "Órdenes Médicas", key: "medical-orders", icon: "assignment", route: "/medical-orders" },
    { type: "collapse", name: "Estudios", key: "studies", icon: "science", route: "/studies" },
    
    // Referencias
    { type: "title", name: "REFERENCIAS", key: "references-title" },
    { type: "collapse", name: "Laboratorio", key: "laboratory", icon: "biotech", route: "/laboratory" },
    { type: "collapse", name: "Fármacos", key: "drugs", icon: "medication", route: "/drugs" },
    { type: "collapse", name: "CIE-10", key: "cie10", icon: "article", route: "/cie10" },
    
    // Personal
    { type: "title", name: "PERSONAL", key: "personal-title" },
    { type: "collapse", name: "Mi Perfil", key: "profile", icon: "person", route: "/profile" },
    { type: "collapse", name: "Horarios", key: "schedule", icon: "schedule", route: "/schedule" }
  ]
};

// Datos simulados para el rol de farmacéutico
const pharmacistMockData = {
  userData: {
    id: 5,
    name: "Farmacéutico Demo",
    email: "farmacia@saluda.com",
    avatar: "https://ui-avatars.com/api/?name=Farmacia+Demo&background=FF5722&color=fff",
    role: "pharmacist",
    fk_sucursal: 1,
    permissions: ["inventory", "dispensation", "purchases"]
  },
  dashboardData: {
    stats: [
      { title: "Dispensaciones Hoy", value: "28", icon: "local_pharmacy", color: "primary" },
      { title: "Recetas Pendientes", value: "7", icon: "receipt", color: "warning" },
      { title: "Prod. Bajos Stock", value: "12", icon: "inventory", color: "error" },
      { title: "Ventas Hoy", value: "$4,250", icon: "payments", color: "success" }
    ],
    pendingPrescriptions: [
      { id: 1, patient: "Laura Jiménez", doctor: "Dr. Ramírez", time: "09:30", items: 3, status: "En Espera" },
      { id: 2, patient: "Fernando López", doctor: "Dra. Gutiérrez", time: "10:45", items: 2, status: "Preparando" },
      { id: 3, patient: "Gabriela Mora", doctor: "Dr. Vega", time: "12:15", items: 4, status: "En Espera" }
    ],
    lowStockProducts: [
      { id: 1, name: "Paracetamol 500mg", stock: 5, minStock: 20, supplier: "MedicamentosMX" },
      { id: 2, name: "Metformina 850mg", stock: 8, minStock: 15, supplier: "FarmaSuministros" },
      { id: 3, name: "Losartán 50mg", stock: 4, minStock: 10, supplier: "MedicamentosMX" },
      { id: 4, name: "Omeprazol 20mg", stock: 6, minStock: 15, supplier: "FarmaSuministros" }
    ],
    expirationAlerts: [
      { id: 1, name: "Amoxicilina 500mg", stock: 25, expirationDate: "15/06/2023", batch: "AM500-23-05" },
      { id: 2, name: "Clonazepam 2mg", stock: 12, expirationDate: "30/06/2023", batch: "CL2-23-06" }
    ]
  },
  menuItems: [
    // Principal
    { type: "title", name: "FARMACIA", key: "pharmacy-title" },
    { type: "collapse", name: "Dashboard", key: "dashboard", icon: "dashboard", route: "/dashboard" },
    { type: "collapse", name: "Dispensación", key: "dispensation", icon: "local_pharmacy", route: "/dispensation" },
    { type: "collapse", name: "Punto de Venta", key: "pos", icon: "point_of_sale", route: "/pos" },
    
    // Recetas y prescripciones
    { type: "title", name: "RECETAS", key: "prescriptions-title" },
    { type: "collapse", name: "Pendientes", key: "pending", icon: "pending_actions", route: "/pending" },
    { type: "collapse", name: "Historial", key: "history", icon: "history", route: "/history" },
    { type: "collapse", name: "Búsqueda", key: "search", icon: "search", route: "/search" },
    
    // Inventario
    { type: "title", name: "INVENTARIO", key: "inventory-title" },
    { type: "collapse", name: "Productos", key: "products", icon: "medication", route: "/products" },
    { type: "collapse", name: "Stock Bajo", key: "low-stock", icon: "warning", route: "/low-stock" },
    { type: "collapse", name: "Caducidades", key: "expirations", icon: "event_busy", route: "/expirations" },
    { type: "collapse", name: "Movimientos", key: "movements", icon: "sync_alt", route: "/movements" },
    
    // Compras
    { type: "title", name: "COMPRAS", key: "purchases-title" },
    { type: "collapse", name: "Órdenes", key: "orders", icon: "shopping_cart", route: "/orders" },
    { type: "collapse", name: "Proveedores", key: "suppliers", icon: "local_shipping", route: "/suppliers" },
    { type: "collapse", name: "Recepción", key: "reception", icon: "inventory_2", route: "/reception" },
    
    // Personal
    { type: "title", name: "PERSONAL", key: "personal-title" },
    { type: "collapse", name: "Mi Perfil", key: "profile", icon: "person", route: "/profile" },
    { type: "collapse", name: "Reportes", key: "reports", icon: "analytics", route: "/reports" }
  ]
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
  adminMockData, 
  sellerMockData, 
  nurseMockData,
  doctorMockData,
  pharmacistMockData
}; 