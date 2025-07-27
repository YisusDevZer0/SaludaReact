import HttpService from "./http.service";

class DashboardService {
  // Obtener estadísticas del dashboard
  getDashboardStats = async () => {
    try {
      const response = await HttpService.get("dashboard/stats");
      return response;
    } catch (error) {
      console.error("Error obteniendo estadísticas del dashboard:", error);
      throw error;
    }
  };

  // Obtener count de personal activo
  getActivePersonalCount = async () => {
    try {
      const response = await HttpService.get("personal/active/count");
      return response;
    } catch (error) {
      console.error("Error obteniendo count de personal activo:", error);
      throw error;
    }
  };

  // Obtener estadísticas de ventas
  getSalesStats = async () => {
    try {
      const response = await HttpService.get("dashboard/sales-stats");
      return response;
    } catch (error) {
      console.error("Error obteniendo estadísticas de ventas:", error);
      throw error;
    }
  };

  // Obtener estadísticas de citas
  getAppointmentsStats = async () => {
    try {
      const response = await HttpService.get("dashboard/appointments-stats");
      return response;
    } catch (error) {
      console.error("Error obteniendo estadísticas de citas:", error);
      throw error;
    }
  };

  // Obtener transacciones recientes
  getRecentTransactions = async () => {
    try {
      const response = await HttpService.get("dashboard/recent-transactions");
      return response;
    } catch (error) {
      console.error("Error obteniendo transacciones recientes:", error);
      throw error;
    }
  };

  // Obtener alertas de inventario
  getInventoryAlerts = async () => {
    try {
      const response = await HttpService.get("dashboard/inventory-alerts");
      return response;
    } catch (error) {
      console.error("Error obteniendo alertas de inventario:", error);
      throw error;
    }
  };
}

export default new DashboardService(); 