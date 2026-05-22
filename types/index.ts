// ─── Enums ───────────────────────────────────────────────────────────────────

export type Rol = "ciudadano" | "administrador";

export type EstadoReporte = "Pendiente" | "En proceso" | "Resuelto";

export type CategoriaReporte =
  | "Vialidad"
  | "Alumbrado"
  | "Agua potable"
  | "Limpieza"
  | "Seguridad"
  | "Infraestructura"
  | "Otro";

// ─── Entidades principales ────────────────────────────────────────────────────

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  fechaRegistro: Date;
}

export interface Categoria {
  id: string;
  nombre: CategoriaReporte;
  descripcion?: string;
}

export interface Estado {
  id: string;
  nombre: EstadoReporte;
}

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  categoria: CategoriaReporte;
  estado: EstadoReporte;
  fechaCreacion: Date;
  usuarioId: string;
  usuario?: Usuario;
  asignacion?: Asignacion;
}

export interface Asignacion {
  id: string;
  reporteId: string;
  adminId: string;
  admin?: Usuario;
  fechaAsignacion: Date;
}

// ─── DTOs (Data Transfer Objects) ────────────────────────────────────────────

/** Datos para crear un reporte nuevo */
export interface CrearReporteDTO {
  titulo: string;
  descripcion: string;
  ubicacion: string;
  categoria: CategoriaReporte;
}

/** Datos para registrar un usuario */
export interface RegistrarUsuarioDTO {
  nombre: string;
  correo: string;
  contrasena: string;
}

/** Datos para iniciar sesión */
export interface LoginDTO {
  correo: string;
  contrasena: string;
}

/** Actualizar estado de un reporte */
export interface ActualizarEstadoDTO {
  estado: EstadoReporte;
}

// ─── Respuestas de API ────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}
