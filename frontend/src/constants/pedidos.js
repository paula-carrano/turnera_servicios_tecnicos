export const TABS = [
  { id: 'SIN_ASIGNAR', label: 'Sin asignar', icon: 'inbox', description: 'Pedidos pendientes de coordinar una visita.', empty: 'No hay pedidos sin asignar', hint: 'Los nuevos pedidos aparecerán acá, listos para coordinar su visita.' },
  { id: 'ASIGNADOS', label: 'Asignados', icon: 'calendar', description: 'Visitas programadas, ordenadas por fecha y hora.', empty: 'Todavía no hay visitas asignadas', hint: 'Asigná una fecha y un horario desde el detalle de un pedido pendiente.' },
  { id: 'PRUEBA', label: 'En prueba', icon: 'tool', description: 'Servicios en seguimiento para comprobar su funcionamiento.', empty: 'No hay pedidos en prueba', hint: 'Los pedidos que marques como PRUEBA se mostrarán acá.' },
  { id: 'FINALIZADOS', label: 'Finalizados', icon: 'check', description: 'Servicios finalizados y su historial de atención.', empty: 'Todavía no hay pedidos finalizados', hint: 'Cuando completes un servicio, cambialo a FINALIZADO para verlo acá.' },
];
export const FIELDS = [
  { name: 'numero_cuenta', label: 'Número de cuenta', max: 80, placeholder: 'Ej. 00012345' },
  { name: 'titular', label: 'Titular de la cuenta', max: 200, placeholder: 'Nombre y apellido' },
  { name: 'direccion', label: 'Dirección', max: 500, placeholder: 'Calle, número, localidad y provincia', wide: true },
  { name: 'motivo', label: 'Motivo del servicio', max: 3000, placeholder: 'Contá qué sucede y qué necesita revisar el técnico', wide: true, multiline: true },
  { name: 'operador', label: 'Operador que generó el pedido', max: 120, placeholder: 'Nombre del operador', wide: true },
];
