# C# Quest — guía para Claude Code

## Objetivo

C# Quest es una app móvil tipo Duolingo para estudiar C# y .NET con lecciones, preguntas de opción múltiple, repaso obligatorio, progreso persistente y sincronización opcional con Google Sheets.

## Comandos

```bash
npm install
npm run dev
npm run lint
npm test
```

## Estructura importante

- `app/page.tsx`: navegación, progreso local, práctica general y sincronización.
- `app/curriculum-progress.tsx`: ruta, estados No iniciado / En progreso / Completado.
- `app/lesson-viewer.tsx`: visor de pasos y preguntas.
- `app/advanced-lessons.ts`: bancos de preguntas de módulos 4–10.
- `app/study-topics.tsx`: glosario buscable de temas estudiados.
- `app/google-sync.ts`: envío de respuestas a Google Sheets.
- `google-apps-script/Code.gs`: endpoint Apps Script para guardar respuestas.

## Reglas del producto

1. Cada paso debe tener resumen, ejemplo y exactamente 10 preguntas exclusivas.
2. Las preguntas deben mostrar el código necesario para responder.
3. Las preguntas deben ser concretas, con distractores y trampas de entrevista; no usar enunciados genéricos.
4. Un error obliga a repasar antes de avanzar.
5. No borrar ni cambiar la clave `csharp-quest-progress-v1` sin migración compatible.
6. Mantener la selección visual de la respuesta y los estados persistentes.
7. No agregar minutos como si fueran videos: aquí son conceptos y pasos.
8. Antes de publicar cambios: ejecutar `npm run lint` y `npm test`.

## Uso con agentes

Divide el trabajo por módulos o pasos. Un agente puede investigar conceptos, otro revisar exactitud de preguntas y otro validar código. El agente principal debe integrar cambios, ejecutar pruebas y revisar que no se modifique el esquema de progreso.

## Google Sheets

El usuario debe copiar `google-apps-script/Code.gs` a Apps Script, colocar el ID de su hoja y desplegarlo como aplicación web. Luego pega la URL en la sección Google Sheets de la app.
