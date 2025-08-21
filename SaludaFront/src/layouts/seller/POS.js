/**
=========================================================
* SaludaReact - Menú de Punto de Venta para Vendedor
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";

// React components
import { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Servicios para cargar productos REALES y realizar ventas
import productosService from "../../services/productos-service";
import ventaService from "../../services/venta-service";

// ELIMINADOS DATOS MOCK - Ahora se cargan productos REALES de BD

const paymentMethods = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta de crédito/débito" },
  { value: "transferencia", label: "Transferencia" },
  { value: "credito", label: "Crédito" },
];

function POS() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // Productos REALES de BD
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [cashReceived, setCashReceived] = useState("");
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [processingVenta, setProcessingVenta] = useState(false);
  const [ventaCompleted, setVentaCompleted] = useState(false);

  // Cargar productos REALES de la base de datos
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await productosService.getProductos();
      const productosData = response.data || response || [];
      
      // Formatear productos para POS con datos reales
      const formattedProducts = productosData.map(producto => ({
        id: producto.id,
        name: producto.nombre || producto.codigo,
        price: parseFloat(producto.precio_venta) || 0,
        stock: parseInt(producto.stock_actual) || 0,
        image: producto.nombre ? producto.nombre.charAt(0).toUpperCase() : "P",
        color: "info",
        codigo: producto.codigo,
        descripcion: producto.descripcion,
        categoria: producto.categoria?.nombre,
        marca: producto.marca?.Nom_Marca
      }));
      
      setProducts(formattedProducts);
      console.log(`✅ Cargados ${formattedProducts.length} productos REALES de BD`);
      
    } catch (error) {
      console.error("❌ Error cargando productos reales:", error);
      setError("Error al cargar productos desde la base de datos");
      setProducts([]); // Sin productos si falla la carga
    } finally {
      setLoading(false);
    }
  };

  // Cargar clientes REALES de la base de datos
  const loadClientes = async () => {
    try {
      const response = await ventaService.getClientes();
      const clientesData = response.data || response || [];
      
      // Formatear clientes para el selector
      const formattedClientes = clientesData.map(cliente => ({
        id: cliente.id,
        label: `${cliente.nombre} ${cliente.apellido || ''}`.trim(),
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        documento: cliente.documento,
        telefono: cliente.telefono,
        email: cliente.email
      }));
      
      setClientes(formattedClientes);
      console.log(`✅ Cargados ${formattedClientes.length} clientes REALES de BD`);
      
    } catch (error) {
      console.error("❌ Error cargando clientes:", error);
      setClientes([]);
    }
  };

  // Cargar productos y clientes al montar el componente
  useEffect(() => {
    loadProducts();
    loadClientes();
  }, []);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.findIndex(item => item.product.id === selectedProduct.id);
    
    if (existingItemIndex >= 0) {
      // Actualizar cantidad si ya existe
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += Number(quantity);
      setCart(updatedCart);
    } else {
      // Agregar nuevo producto al carrito
      setCart([...cart, {
        product: selectedProduct,
        quantity: Number(quantity),
        subtotal: selectedProduct.price * Number(quantity)
      }]);
    }
    
    // Limpiar selección
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    newCart[index].subtotal = newCart[index].product.price * newQuantity;
    setCart(newCart);
  };

  const handleCompletePayment = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    try {
      setProcessingVenta(true);
      
      // Preparar datos de la venta con todos los campos requeridos
      const ventaData = {
        cliente_id: selectedCliente?.id || 1, // Cliente general si no se selecciona
        personal_id: 1, // Usuario actual o ID por defecto
        sucursal_id: 1, // Sucursal por defecto
        numero_venta: '', // Se generará automáticamente
        numero_documento: '', // Se generará automáticamente
        serie_documento: 'A',
        tipo_venta: 'contado', // Por defecto contado
        estado: 'confirmada', // Estado confirmada para ventas completadas
        tipo_documento: 'ticket',
        subtotal: subtotal,
        descuento_total: 0,
        subtotal_con_descuento: subtotal,
        iva_total: tax,
        impuestos_adicionales: 0,
        total: total,
        total_pagado: total,
        saldo_pendiente: 0, // Para ventas de contado
        metodo_pago: paymentMethod,
        observaciones: `Venta realizada desde POS - ${cart.length} productos`,
        detalles: cart.map(item => ({
            producto_id: item.product.id,
            codigo_producto: item.product.codigo || 'PROD' + item.product.id,
            nombre_producto: item.product.nombre || 'Producto ' + item.product.id,
            descripcion_producto: item.product.descripcion || '',
            codigo_barras: item.product.codigo_barras || '',
            cantidad: item.quantity,
            precio_unitario: item.product.price,
            precio_total: item.subtotal,
            costo_unitario: item.product.costo || 0,
            costo_total: (item.product.costo || 0) * item.quantity,
            descuento_porcentaje: 0,
            descuento_monto: 0,
            subtotal_con_descuento: item.subtotal,
            iva_porcentaje: 16,
            iva_monto: item.subtotal * 0.16,
            impuestos_adicionales: 0,
            total_linea: item.subtotal * 1.16,
            estado: 'confirmado'
          }))
      };

      console.log("🛒 Procesando venta:", ventaData);
      
      const response = await ventaService.createVenta(ventaData);
      
      if (response.success) {
        setVentaCompleted(true);
        alert(`✅ Venta completada exitosamente!\nTotal: €${total.toFixed(2)}\nMétodo: ${paymentMethod}\nFolio: ${response.data?.id || 'N/A'}`);
        
        // Limpiar el carrito y formulario
        setCart([]);
        setPaymentMethod("efectivo");
        setCashReceived("");
        setSelectedCliente(null);
        setVentaCompleted(false);
        
        // Recargar productos para actualizar stock
        loadProducts();
      } else {
        throw new Error(response.message || "Error al procesar la venta");
      }
      
    } catch (error) {
      console.error("❌ Error al procesar venta:", error);
      alert(`❌ Error al procesar la venta: ${error.message}`);
    } finally {
      setProcessingVenta(false);
    }
  };

  // Calcular totales
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.16; // IVA 16%
  const total = subtotal + tax;
  const change = cashReceived ? parseFloat(cashReceived) - total : 0;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Encabezado */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={8}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium">
                Punto de Venta
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Sistema de ventas y facturación
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="info" startIcon={<Icon>group</Icon>}>
              Historial de ventas
            </MDButton>
          </Grid>
        </Grid>

        {/* Contenido principal */}
        <Grid container spacing={3}>
          {/* Lado izquierdo - Selección de productos */}
          <Grid item xs={12} md={7}>
            <Card sx={{ overflow: "visible" }}>
              <MDBox p={3}>
                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                  Selección de productos
                </MDTypography>
                
                {/* Estado de carga */}
                {loading && (
                  <MDBox textAlign="center" py={2}>
                    <MDTypography variant="body2" color="info">
                      Cargando productos desde la base de datos...
                    </MDTypography>
                  </MDBox>
                )}
                
                {error && (
                  <MDBox textAlign="center" py={2}>
                    <MDTypography variant="body2" color="error">
                      {error}
                    </MDTypography>
                  </MDBox>
                )}
                
                {!loading && !error && products.length === 0 && (
                  <MDBox textAlign="center" py={2}>
                    <MDTypography variant="body2" color="warning">
                      No hay productos disponibles en la base de datos
                    </MDTypography>
                  </MDBox>
                )}
                
                {/* Buscador de productos */}
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={8}>
                    <Autocomplete
                      options={products}
                      getOptionLabel={(option) => option.name}
                      disabled={loading || products.length === 0}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <MDBox display="flex" alignItems="center">
                            <MDAvatar
                              bgColor={option.color}
                              size="sm"
                              sx={{ mr: 1 }}
                            >
                              {option.image}
                            </MDAvatar>
                            <MDBox>
                              <MDTypography variant="button" fontWeight="medium">
                                {option.name}
                              </MDTypography>
                              <MDTypography variant="caption" color="text" display="block">
                                ${option.price.toFixed(2)} - Stock: {option.stock}
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        </li>
                      )}
                      value={selectedProduct}
                      onChange={(event, newValue) => {
                        setSelectedProduct(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Buscar producto"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      label="Cantidad"
                      type="number"
                      fullWidth
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <MDButton
                      variant="gradient"
                      color="success"
                      fullWidth
                      sx={{ height: "100%" }}
                      onClick={handleAddToCart}
                      disabled={!selectedProduct}
                    >
                      <Icon>add_shopping_cart</Icon>
                    </MDButton>
                  </Grid>
                </Grid>

                {/* Carrito de compras */}
                <MDBox>
                  <TableContainer sx={{ boxShadow: "none" }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
                        <TableRow>
                          <TableCell>Producto</TableCell>
                          <TableCell>Precio</TableCell>
                          <TableCell>Cantidad</TableCell>
                          <TableCell>Subtotal</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cart.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              <MDTypography variant="body2" color="text">
                                El carrito está vacío
                              </MDTypography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          cart.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <MDBox display="flex" alignItems="center">
                                  <MDAvatar
                                    bgColor={item.product.color}
                                    size="sm"
                                    sx={{ mr: 1 }}
                                  >
                                    {item.product.image}
                                  </MDAvatar>
                                  <MDTypography variant="button" fontWeight="medium">
                                    {item.product.name}
                                  </MDTypography>
                                </MDBox>
                              </TableCell>
                              <TableCell>${item.product.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <MDBox display="flex" alignItems="center">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                  >
                                    <Icon>remove</Icon>
                                  </IconButton>
                                  <MDTypography variant="button" fontWeight="medium" mx={1}>
                                    {item.quantity}
                                  </MDTypography>
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                  >
                                    <Icon>add</Icon>
                                  </IconButton>
                                </MDBox>
                              </TableCell>
                              <TableCell>${(item.quantity * item.product.price).toFixed(2)}</TableCell>
                              <TableCell>
                                <IconButton 
                                  color="error" 
                                  size="small"
                                  onClick={() => handleRemoveItem(index)}
                                >
                                  <Icon>delete</Icon>
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MDBox>
                
                {/* Acciones */}
                <MDBox mt={2} display="flex" justifyContent="space-between">
                  <MDButton 
                    variant="outlined" 
                    color="error" 
                    disabled={cart.length === 0}
                    onClick={() => setCart([])}
                    startIcon={<Icon>delete_sweep</Icon>}
                  >
                    Vaciar carrito
                  </MDButton>
                  <MDButton
                    variant="gradient"
                    color="dark"
                    startIcon={<Icon>receipt</Icon>}
                  >
                    Guardar cotización
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          {/* Lado derecho - Totales y pago */}
          <Grid item xs={12} md={5}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                  Resumen de la venta
                </MDTypography>

                {/* Cliente */}
                <MDBox mb={3}>
                  <Autocomplete
                    options={clientes}
                    value={selectedCliente}
                    onChange={(event, newValue) => setSelectedCliente(newValue)}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Seleccionar Cliente"
                        variant="outlined"
                        placeholder="Cliente general..."
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <Icon sx={{ mr: 1 }}>person</Icon>
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MDBox component="li" {...props}>
                        <MDBox>
                          <MDTypography variant="button" fontWeight="medium">
                            {option.label}
                          </MDTypography>
                          {option.documento && (
                            <MDTypography variant="caption" color="text">
                              Doc: {option.documento}
                            </MDTypography>
                          )}
                        </MDBox>
                      </MDBox>
                    )}
                    noOptionsText="No hay clientes disponibles"
                    disabled={loading}
                  />
                </MDBox>
                
                {/* Totales */}
                <MDBox mb={3}>
                  <Card variant="outlined" sx={{ boxShadow: "none" }}>
                    <MDBox p={2}>
                      <MDBox display="flex" justifyContent="space-between" mb={1}>
                        <MDTypography variant="button" color="text">
                          Subtotal:
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="medium">
                          ${subtotal.toFixed(2)}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" justifyContent="space-between" mb={1}>
                        <MDTypography variant="button" color="text">
                          IVA (16%):
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="medium">
                          ${tax.toFixed(2)}
                        </MDTypography>
                      </MDBox>
                      <Divider />
                      <MDBox display="flex" justifyContent="space-between" mt={1}>
                        <MDTypography variant="h6" color="dark">
                          Total:
                        </MDTypography>
                        <MDTypography variant="h6" fontWeight="medium">
                          ${total.toFixed(2)}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </Card>
                </MDBox>
                
                {/* Método de pago */}
                <MDBox mb={3}>
                  <MDBox mb={1}>
                    <MDTypography variant="button" fontWeight="medium">
                      Método de pago
                    </MDTypography>
                  </MDBox>
                  <MDInput
                    select
                    fullWidth
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    {paymentMethods.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </MDInput>
                </MDBox>
                
                {/* Efectivo recibido (solo si el pago es en efectivo) */}
                {paymentMethod === "efectivo" && (
                  <MDBox mb={3}>
                    <MDBox mb={1}>
                      <MDTypography variant="button" fontWeight="medium">
                        Efectivo recibido
                      </MDTypography>
                    </MDBox>
                    <MDInput
                      type="number"
                      fullWidth
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <MDTypography variant="h6" color="text">
                            $
                          </MDTypography>
                        ),
                      }}
                    />
                    {cashReceived && parseFloat(cashReceived) >= total && (
                      <MDBox mt={1}>
                        <MDTypography variant="button" fontWeight="medium" color="success">
                          Cambio: ${change.toFixed(2)}
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                )}

                {/* Botones de acción */}
                <MDBox display="flex" flexDirection="column" gap={2}>
                  <MDButton
                    variant="gradient"
                    color="success"
                    fullWidth
                    onClick={handleCompletePayment}
                    disabled={processingVenta || cart.length === 0 || (paymentMethod === "efectivo" && (!cashReceived || parseFloat(cashReceived) < total))}
                    startIcon={<Icon>{processingVenta ? "hourglass_top" : "payment"}</Icon>}
                    size="large"
                  >
                    {processingVenta ? "Procesando venta..." : "Completar pago"}
                  </MDButton>
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    startIcon={<Icon>print</Icon>}
                    disabled={cart.length === 0}
                  >
                    Imprimir recibo
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default POS;
 