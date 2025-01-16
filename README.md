### --------------------------------------Description-------------------------------------- ###
## E-commerce
### Vite + TypeScript

### --------------------------------------Typescript documentation-------------------------------------- ###
## Diferencias entre Controller y FormField (react-hook-form):===============================================================================================
### Controller:
  Propósito: El Controller es un componente de react-hook-form diseñado específicamente para manejar componentes controlados. Esto es especialmente útil para componentes personalizados o de terceros que no exponen directamente el ref o no son compatibles con el registro automático de react-hook-form.
  Funcionamiento: Proporciona un render prop que recibe un objeto con propiedades como field y fieldState. El field contiene métodos como onChange, onBlur, value, etc., que se deben pasar al componente controlado para que react-hook-form pueda gestionar su estado.
  Ventaja: Permite una integración más directa y controlada con el estado del formulario, asegurando que los cambios en el componente se reflejen inmediatamente en el estado del formulario.
### FormField con render:
  Propósito: FormField es un patrón común en formularios para encapsular la lógica de renderizado de un campo de formulario. Sin embargo, no es parte de react-hook-form y su implementación puede variar.
  Funcionamiento: Generalmente, se utiliza para simplificar la estructura del formulario, pero no siempre maneja correctamente los componentes controlados, especialmente si no se integra bien con el estado del formulario.
  Limitación: Puede no proporcionar la misma flexibilidad o control que Controller para componentes que requieren una gestión más compleja del estado.
### Por qué Controller funcionó mejor
  Integración directa: Controller se integra directamente con react-hook-form, lo que significa que maneja automáticamente el registro y la actualización del estado del formulario.
  Manejo de componentes controlados: Al usar Controller, puedes asegurarte de que el componente controlado (como MultiSelect) recibe las funciones necesarias (onChange, value, etc.) para interactuar correctamente con el formulario.
  Flexibilidad: Te permite manejar validaciones y errores de manera más efectiva, ya que el fieldState proporciona información sobre el estado actual del campo.
### ---------------------------------------------------------------------------------------------------- ###