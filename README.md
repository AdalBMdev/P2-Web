# README - Documentación de Endpoints para Gestión de Hábitos
---

## Endpoints

### 1. Crear un Nuevo Hábito
**URL:** `/habits`

**Método:** `POST`

**Descripción:** Permite crear un nuevo hábito en la base de datos.

**Request Body:**
Debe enviarse un objeto JSON con la estructura del nuevo hábito.
```json
{
  "name": "Leer un libro",
  "frequency": "Diario",
  "startTime": "08:00",
  "endTime": "09:00",
  "days": ["Lunes", "Miércoles", "Viernes"]
}
```

**Respuesta Exitosa:**
- **Código 201**: Devuelve el objeto del hábito creado.
```json
{
  "_id": "123456",
  "name": "Leer un libro",
  "frequency": "Diario",
  "startTime": "08:00",
  "endTime": "09:00",
  "days": ["Lunes", "Miércoles", "Viernes"]
}
```

**Errores:**
- **Código 500**: Error en la creación del hábito.

---

### 2. Obtener Todos los Hábitos
**URL:** `/habits`

**Método:** `GET`

**Descripción:** Devuelve una lista de todos los hábitos almacenados en la base de datos.

**Respuesta Exitosa:**
- **Código 200**: Devuelve un array de objetos de hábitos.
```json
[
  {
    "_id": "123456",
    "name": "Leer un libro",
    "frequency": "Diario",
    "startTime": "08:00",
    "endTime": "09:00",
    "days": ["Lunes", "Miércoles", "Viernes"]
  },
  {
    "_id": "789012",
    "name": "Correr",
    "frequency": "Semanal",
    "startTime": "06:00",
    "endTime": "07:00",
    "days": ["Martes", "Jueves"]
  }
]
```

**Errores:**
- **Código 500**: Error al obtener la lista de hábitos.

---

### 3. Actualizar un Hábito
**URL:** `/habits/:id`

**Método:** `PUT`

**Descripción:** Actualiza un hábito existente en la base de datos.

**Parámetros de URL:**
- `id` (string): ID del hábito a actualizar.

**Request Body:**
Debe enviarse un objeto JSON con los datos actualizados.
```json
{
  "name": "Leer más de un libro",
  "endTime": "10:00",
  "days": ["Lunes", "Martes"]
}
```

**Respuesta Exitosa:**
- **Código 200**: Mensaje de éxito indicando que el hábito se actualizó correctamente.
```json
{
  "message": "Hábito actualizado con éxito"
}
```

**Errores:**
- **Código 500**: Error en la actualización del hábito.
- **Código 404**: No se encontró el hábito con el ID especificado.

---

### 4. Eliminar un Hábito
**URL:** `/habits/:id`

**Método:** `DELETE`

**Descripción:** Elimina un hábito existente en la base de datos.

**Parámetros de URL:**
- `id` (string): ID del hábito a eliminar.

**Respuesta Exitosa:**
- **Código 200**: Mensaje de éxito indicando que el hábito se eliminó correctamente.
```json
{
  "message": "Hábito eliminado con éxito"
}
```

**Errores:**
- **Código 500**: Error al eliminar el hábito.
- **Código 404**: No se encontró el hábito con el ID especificado.

---

## Comentarios sobre la Función del Backend
Este backend maneja la gestión de hábitos mediante operaciones básicas de CRUD (Create, Read, Update, Delete).

El flujo de trabajo general incluye:
1. **Creación de hábitos:** Recibe los datos del hábito en el cuerpo de la solicitud y los inserta en la base de datos.
2. **Lectura de hábitos:** Recupera y devuelve todos los hábitos existentes.
3. **Actualización de hábitos:** Localiza un hábito por su ID y actualiza los campos especificados.
4. **Eliminación de hábitos:** Elimina un hábito identificado por su ID, asegurando que exista antes de su eliminación.

