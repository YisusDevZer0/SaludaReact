# Sistema de Temas Adaptativo

## Descripción General

El sistema de temas implementado permite que toda la aplicación se adapte automáticamente al modo oscuro o claro según las preferencias del usuario. El sistema está diseñado para ser consistente y fácil de usar.

## Componentes Principales

### 1. Hook `useTheme`

El hook principal que proporciona acceso a todos los colores y estilos adaptativos:

```javascript
import useTheme from 'hooks/useTheme';

const MyComponent = () => {
  const { darkMode, colors, componentStyles, utils } = useTheme();
  
  return (
    <div style={{ backgroundColor: colors.background.primary }}>
      {/* Contenido */}
    </div>
  );
};
```

### 2. Componentes Temáticos

#### ThemedCard
```javascript
import ThemedCard from 'components/ThemedCard';

<ThemedCard>
  <div>Contenido de la card</div>
</ThemedCard>
```

#### ThemedInput
```javascript
import ThemedInput from 'components/ThemedInput';

<ThemedInput 
  label="Nombre"
  placeholder="Ingrese su nombre"
/>
```

#### ThemedButton
```javascript
import ThemedButton from 'components/ThemedButton';

<ThemedButton variant="contained" color="primary">
  Guardar
</ThemedButton>
```

### 3. TableThemeProvider

Para tablas que necesitan estilos especiales:

```javascript
import TableThemeProvider from 'components/StandardDataTable/TableThemeProvider';

<TableThemeProvider>
  <MyTableComponent />
</TableThemeProvider>
```

## Estructura de Colores

### Fondos
- `colors.background.primary`: Fondo principal
- `colors.background.secondary`: Fondo secundario
- `colors.background.card`: Fondo de cards
- `colors.background.table`: Fondo de tablas

### Textos
- `colors.text.primary`: Texto principal
- `colors.text.secondary`: Texto secundario
- `colors.text.disabled`: Texto deshabilitado

### Estados
- `colors.status.success`: Estados exitosos
- `colors.status.error`: Estados de error
- `colors.status.warning`: Estados de advertencia
- `colors.status.info`: Estados informativos

## Cómo Implementar en Nuevos Componentes

### 1. Usar el hook useTheme
```javascript
import useTheme from 'hooks/useTheme';

const MyComponent = () => {
  const { colors } = useTheme();
  
  return (
    <div style={{ 
      backgroundColor: colors.background.card,
      color: colors.text.primary 
    }}>
      Contenido
    </div>
  );
};
```

### 2. Usar componentes temáticos
```javascript
import ThemedCard from 'components/ThemedCard';
import ThemedInput from 'components/ThemedInput';
import ThemedButton from 'components/ThemedButton';

const MyForm = () => {
  return (
    <ThemedCard>
      <ThemedInput label="Campo" />
      <ThemedButton>Enviar</ThemedButton>
    </ThemedCard>
  );
};
```

### 3. Para tablas complejas
```javascript
import TableThemeProvider from 'components/StandardDataTable/TableThemeProvider';

const MyTablePage = () => {
  return (
    <TableThemeProvider>
      <MyComplexTable />
    </TableThemeProvider>
  );
};
```

## Mejores Prácticas

1. **Siempre usar el hook useTheme** en lugar de colores hardcodeados
2. **Usar componentes temáticos** cuando sea posible
3. **Mantener consistencia** en el uso de colores
4. **Probar en ambos modos** (oscuro y claro)
5. **Usar transiciones suaves** para cambios de tema

## Transiciones

El sistema incluye transiciones automáticas para cambios suaves entre temas:

```javascript
// Las transiciones se aplican automáticamente
transition: 'background-color 0.3s ease, color 0.3s ease'
```

## Compatibilidad

- ✅ Material-UI Components
- ✅ React Data Table Component
- ✅ Custom Components
- ✅ Forms y Inputs
- ✅ Cards y Layouts
- ✅ Tablas y Datos

## Troubleshooting

### Problema: Componente no se adapta al tema
**Solución**: Asegúrate de usar `useTheme` o componentes temáticos

### Problema: Colores inconsistentes
**Solución**: Usa siempre los colores del hook `useTheme`

### Problema: Tabla no se ve bien en modo oscuro
**Solución**: Envuelve la tabla con `TableThemeProvider` 