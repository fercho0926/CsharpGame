---
name: sql-course-architect
description: Organiza y construye cursos SQL incrementales, como un profesor experto, con prerequisitos, explicación, ejemplos, práctica guiada, preguntas y evaluación.
metadata:
  short-description: Diseña cursos SQL paso a paso
---

# Arquitecto de cursos SQL

Usa esta skill al crear, reorganizar o ampliar cualquier curso, módulo, tema, laboratorio o banco de preguntas SQL.

## Secuencia didáctica obligatoria

Cada módulo debe seguir este recorrido:

1. Objetivo y conocimientos previos.
2. Explicación conceptual en español, de lo simple a lo complejo.
3. Ejemplo visual o analogía.
4. Ejemplo SQL explicado línea por línea.
5. Práctica guiada con una variación pequeña.
6. Preguntas de comprensión y preguntas tipo entrevista.
7. Reto aplicado sin solución inmediata.
8. Resumen, errores frecuentes y criterio para avanzar.

No muestres un laboratorio o un examen antes de presentar el concepto que evalúa. Las actividades avanzadas deben desbloquearse después de los fundamentos relacionados.

## Orden recomendado para SQL

RDBMS y tablas → modelo Entidad–Relación → claves y cardinalidad → SELECT → filtros con WHERE → funciones agregadas → GROUP BY → HAVING → ORDER BY → JOIN → subconsultas → CTE → ventanas → transacciones y rendimiento.

## Preguntas y progreso

- Cada tema debe tener su propio banco identificable.
- Las preguntas deben mezclar opción múltiple, lectura de código y entrevista.
- Registrar respuesta, acierto, intento, tema y fecha en el sistema de progreso existente.
- Al completar un banco, mostrar resumen con correctas, incorrectas, porcentaje y siguiente paso.
- Mantener el progreso al recargar y no reiniciar índices accidentalmente.

## Revisión antes de entregar

Comprueba que el estudiante entienda el tema antes de practicar, que cada botón lleve al siguiente paso lógico, que los ejemplos usen nombres coherentes y que el contenido no salte de nivel. Ejecuta build de producción y revisa la UX/UI con la skill `ux-ui-quality`.
