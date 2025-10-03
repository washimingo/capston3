import { Tutorial } from "../interfaces/tutorial";

export const TUTORIALS_DATA: Tutorial[] = [
  {
    id: '1',
    title: 'Primeros Pasos en SAF',
    description: 'Aprende los conceptos básicos para comenzar a usar la plataforma SAF de manera efectiva.',
    category: 'basico',
    difficulty: 'principiante',
    level: 'Principiante',
    duration: 15,
    progress: 0,
    icon: 'rocket-outline',
    color: 'blue',
    objectives: [
      'Navegar por la interfaz principal',
      'Entender el menú lateral',
      'Configurar tu perfil básico',
      'Realizar tu primera acción'
    ],
    steps: [
      { title: 'Acceder al Dashboard', description: 'Conoce la página principal y sus elementos', completed: false },
      { title: 'Explorar el Menú', description: 'Navega por las diferentes secciones', completed: false },
      { title: 'Configurar Perfil', description: 'Establece tu información personal', completed: false },
      { title: 'Primera Interacción', description: 'Realiza tu primera tarea en el sistema', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Gestión de Facturas',
    description: 'Domina el proceso completo de creación, edición y seguimiento de facturas en el sistema.',
    category: 'facturacion',
    difficulty: 'intermedio',
    level: 'Intermedio',
    duration: 25,
    progress: 60,
    icon: 'document-text-outline',
    color: 'green',
    objectives: [
      'Crear facturas desde cero',
      'Editar facturas existentes',
      'Gestionar estados de facturación',
      'Configurar alertas automáticas'
    ],
    steps: [
      { title: 'Crear Nueva Factura', description: 'Proceso paso a paso para generar facturas', completed: true },
      { title: 'Editar Información', description: 'Modificar datos de facturas existentes', completed: true },
      { title: 'Estados de Factura', description: 'Gestionar el ciclo de vida de las facturas', completed: true },
      { title: 'Configurar Alertas', description: 'Establecer notificaciones automáticas', completed: false }
    ]
  },
  {
    id: '3',
    title: 'Dashboard y Análisis',
    description: 'Interpreta métricas clave y utiliza el dashboard para tomar decisiones informadas.',
    category: 'reportes',
    difficulty: 'intermedio',
    level: 'Intermedio',
    duration: 20,
    progress: 30,
    icon: 'analytics-outline',
    color: 'purple',
    objectives: [
      'Interpretar métricas del dashboard',
      'Generar reportes personalizados',
      'Exportar datos relevantes',
      'Configurar vistas personalizadas'
    ],
    steps: [
      { title: 'Leer Métricas', description: 'Entender los indicadores principales', completed: true },
      { title: 'Filtrar Información', description: 'Personalizar la vista de datos', completed: true },
      { title: 'Generar Reportes', description: 'Crear informes detallados', completed: false },
      { title: 'Exportar Datos', description: 'Descargar información en diferentes formatos', completed: false }
    ]
  },
  {
    id: '4',
    title: 'Configuración del Sistema',
    description: 'Personaliza la plataforma según las necesidades específicas de tu organización.',
    category: 'configuracion',
    difficulty: 'avanzado',
    level: 'Avanzado',
    duration: 35,
    progress: 0,
    icon: 'settings-outline',
    color: 'orange',
    objectives: [
      'Configurar parámetros generales',
      'Gestionar usuarios y permisos',
      'Personalizar notificaciones',
      'Establecer flujos de trabajo'
    ],
    steps: [
      { title: 'Parámetros Generales', description: 'Configurar ajustes básicos del sistema', completed: false },
      { title: 'Gestión de Usuarios', description: 'Administrar roles y permisos', completed: false },
      { title: 'Notificaciones', description: 'Personalizar alertas y comunicaciones', completed: false },
      { title: 'Flujos de Trabajo', description: 'Crear procesos automatizados', completed: false }
    ]
  },
  {
    id: '5',
    title: 'Reportes Avanzados',
    description: 'Crea reportes detallados y análisis profundos para la toma de decisiones estratégicas.',
    category: 'reportes',
    difficulty: 'avanzado',
    level: 'Avanzado',
    duration: 30,
    progress: 15,
    icon: 'bar-chart-outline',
    color: 'teal',
    objectives: [
      'Crear reportes personalizados',
      'Usar filtros avanzados',
      'Programar reportes automáticos',
      'Compartir análisis con equipos'
    ],
    steps: [
      { title: 'Reportes Personalizados', description: 'Diseñar informes específicos', completed: true },
      { title: 'Filtros Avanzados', description: 'Aplicar criterios complejos de búsqueda', completed: false },
      { title: 'Automatización', description: 'Programar generación automática', completed: false },
      { title: 'Compartir Reportes', description: 'Distribuir análisis al equipo', completed: false }
    ]
  },
  {
    id: '6',
    title: 'Gestión de Alertas',
    description: 'Configura y administra el sistema de notificaciones para mantenerte siempre informado.',
    category: 'basico',
    difficulty: 'principiante',
    level: 'Principiante',
    duration: 18,
    progress: 85,
    icon: 'notifications-outline',
    color: 'red',
    objectives: [
      'Configurar alertas básicas',
      'Personalizar tipos de notificación',
      'Gestionar frecuencia de alertas',
      'Configurar canales de comunicación'
    ],
    steps: [
      { title: 'Alertas Básicas', description: 'Configurar notificaciones esenciales', completed: true },
      { title: 'Tipos de Notificación', description: 'Personalizar diferentes alertas', completed: true },
      { title: 'Frecuencia', description: 'Ajustar timing de notificaciones', completed: true },
      { title: 'Canales', description: 'Configurar email, SMS y push', completed: true }
    ]
  }
];