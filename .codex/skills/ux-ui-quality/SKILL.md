---
name: ux-ui-quality
description: Revisa y mejora la calidad UX/UI de cada nueva sección o componente del proyecto C# Quest, especialmente laboratorios, juegos y experiencias educativas.
metadata:
  short-description: Auditoría UX/UI obligatoria para C# Quest
---

# Calidad UX/UI de C# Quest

Usa esta skill cada vez que se cree o modifique una sección visual, laboratorio, juego, quiz o flujo de progreso del proyecto.

## Objetivo

Entregar una interfaz terminada, legible y coherente con C# Quest. No basta con que compile: la sección debe tener jerarquía visual, estados claros, controles utilizables y buen comportamiento en móvil.

## Revisión obligatoria

1. Inspecciona el componente y sus clases CSS antes de editar. Comprueba que cada bloque importante tenga estilos propios; texto HTML sin composición es un defecto.
2. Revisa la jerarquía: título, explicación breve, acción principal, contenido y feedback deben poder escanearse en segundos.
3. Revisa estados: inicial, hover/focus, deshabilitado, error, éxito, vacío, cargando y finalizado cuando apliquen.
4. Revisa UX educativa: instrucciones antes de la acción, lenguaje en español, ejemplos visibles, feedback que explique el porqué y progreso persistente si existe un recorrido.
5. Revisa accesibilidad básica: botones reales, `label` asociado a campos, foco visible, contraste suficiente, `aria-label` cuando el icono no sea suficiente y no depender solo del color.
6. Revisa responsive en anchos de escritorio y móvil: no permitir desbordamiento horizontal, texto ilegible, botones comprimidos o tablas imposibles de usar.
7. Ejecuta la compilación de producción y corrige errores antes de entregar. Si existe una herramienta de navegador disponible, inspecciona la página renderizada y prueba las interacciones principales; si no está disponible, documenta la limitación y compensa con inspección de código y build.

## Criterios para laboratorios y juegos

- Separar visualmente instrucciones, editor/acciones, resultados y ayuda.
- Usar paneles, espacios y tipografía consistentes con el sistema existente.
- Mostrar mensajes de resultado siempre, incluyendo errores de consulta, resultado vacío y finalización.
- Hacer evidente qué se puede pulsar y qué ocurrió después de pulsarlo.
- Mantener ejemplos seleccionables y controles cómodos en pantallas pequeñas.

## Entrega

Antes de publicar, reporta brevemente qué se revisó, qué se corrigió y qué validación se ejecutó. No publiques una sección que solo funcione técnicamente si su presentación sigue pareciendo HTML sin estilos.
