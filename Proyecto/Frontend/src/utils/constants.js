export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/profile',
    CHANGE_PASSWORD: '/user/password'
  },
  DIAGRAMS: {
    LIST: '/diagrams',
    CREATE: '/diagrams',
    UPDATE: '/diagrams',
    DELETE: '/diagrams'
  }
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  DIAGRAMS: '/dashboard/diagrams',
  HISTORY: '/dashboard/history',
  COLLABORATION: '/dashboard/collaboration'
};

export const MESSAGES = {
  LOADING: 'Cargando...',
  ERROR: 'Ha ocurrido un error',
  SUCCESS: 'Operación exitosa',
  LOGIN_SUCCESS: 'Sesión iniciada correctamente',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
  REGISTER_SUCCESS: 'Cuenta creada exitosamente'
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_EMAIL: 'userEmail',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebarState'
};

export const DIAGRAM_TYPES = {
  CLASS: 'class',
  SEQUENCE: 'sequence', 
  USECASE: 'use_case',
  ACTIVITY: 'activity'
};

export const DIAGRAM_TYPE_LABELS = {
  [DIAGRAM_TYPES.CLASS]: 'Diagrama de Clases',
  [DIAGRAM_TYPES.SEQUENCE]: 'Diagrama de Secuencia',
  [DIAGRAM_TYPES.USECASE]: 'Diagrama de Casos de Uso',
  [DIAGRAM_TYPES.ACTIVITY]: 'Diagrama de Actividad'
};

export const PROGRAMMING_LANGUAGES = {
  CSHARP: 'csharp',
  JAVA: 'java',
  PYTHON: 'python',
  PHP: 'php',
  JAVASCRIPT: 'javascript'
};

export const LANGUAGE_LABELS = {
  [PROGRAMMING_LANGUAGES.CSHARP]: 'C#',
  [PROGRAMMING_LANGUAGES.JAVA]: 'Java',
  [PROGRAMMING_LANGUAGES.PYTHON]: 'Python',
  [PROGRAMMING_LANGUAGES.PHP]: 'PHP',
  [PROGRAMMING_LANGUAGES.JAVASCRIPT]: 'JavaScript'
};
