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
import { useState } from "react";

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

// Datos simulados
const products = [
  { id: 1, name: "Paracetamol 500mg", price: 25.00, stock: 120, image: "P", color: "info" },
  { id: 2, name: "Omeprazol 20mg", price: 30.00, stock: 85, image: "O", color: "success" },
  { id: 3, name: "Loratadina 10mg", price: 20.00, stock: 75, image: "L", color: "warning" },
  { id: 4, name: "Ibuprofeno 400mg", price: 18.00, stock: 90, image: "I", color: "error" },
  { id: 5, name: "Metformina 850mg", price: 22.00, stock: 65, image: "M", color: "dark" },
  { id: 6, name: "Aspirina 500mg", price: 15.00, stock: 200, image: "A", color: "primary" },
  { id: 7, name: "Vitamina C 1000mg", price: 45.00, stock: 40, image: "V", color: "secondary" },
  { id: 8, name: "Amoxicilina 500mg", price: 42.00, stock: 50, image: "A", color: "info" },
  { id: 9, name: "Losartán 50mg", price: 35.00, stock: 80, image: "L", color: "success" },
  { id: 10, name: "Clonazepam 2mg", price: 60.00, stock: 30, image: "C", color: "warning" },
];

const paymentMethods = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta de crédito/débito" },
  { value: "transferencia", label: "Transferencia" },
  { value: "credito", label: "Crédito" },
];

function POS() {
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [cashReceived, setCashReceived] = useState("");

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

  const handleCompletePayment = () => {
    alert("Pago procesado correctamente");
    setCart([]);
    setCashReceived("");
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
                
                {/* Buscador de productos */}
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={8}>
                    <Autocomplete
                      options={products}
                      getOptionLabel={(option) => option.name}
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
                  <MDButton 
                    variant="outlined" 
                    color="info" 
                    startIcon={<Icon>person</Icon>}
                    fullWidth
                  >
                    Seleccionar cliente
                  </MDButton>
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
                    disabled={cart.length === 0 || (paymentMethod === "efectivo" && (!cashReceived || parseFloat(cashReceived) < total))}
                    startIcon={<Icon>payment</Icon>}
                    size="large"
                  >
                    Completar pago
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
 