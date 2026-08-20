// C# Quest → Google Sheets
// 1. Crea una hoja de cálculo nueva.
// 2. Extensiones → Apps Script.
// 3. Pega este archivo y cambia SHEET_ID por el ID de tu hoja.
// 4. Implementar → Nueva implementación → Aplicación web.
// 5. Ejecutar como tú y permitir acceso a cualquiera con el enlace.
const SHEET_ID = "1vMIMabo8EcVYET41Cbe10Hva5J5fsBvDqu-YoEY-c_I";
const TAB_NAME = "Respuestas";

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || "{}");
  if (payload.type === "progreso") return saveProgress_(payload.progress || {});
  const sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Fecha", "Tipo", "Módulo", "Paso", "Tema", "Pregunta", "Respuesta", "Correcta", "XP"]);
  }
  sheet.appendRow([
    new Date(), payload.type || "respuesta", payload.module || "", payload.step || "",
    payload.topic || "", payload.question || "", payload.answer || "",
    payload.correct === true ? "Sí" : "No", payload.xp || 0
  ]);
  return json_({ ok: true });
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "progress") {
    const sheet = getProgressSheet_();
    if (sheet.getLastRow() < 2) return json_({ ok: true, progress: null });
    return json_({ ok: true, progress: JSON.parse(sheet.getRange(2, 3).getValue() || "null") });
  }
  return json_({ ok: true, app: "C# Quest" });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  return spreadsheet.getSheetByName(TAB_NAME) || spreadsheet.insertSheet(TAB_NAME);
}

function getProgressSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName("Progreso") || spreadsheet.insertSheet("Progreso");
  if (sheet.getLastRow() === 0) sheet.appendRow(["Clave", "Fecha", "Estado JSON"]);
  return sheet;
}

function saveProgress_(progress) {
  const sheet = getProgressSheet_();
  let merged = progress;
  if (sheet.getLastRow() >= 2) {
    const previous = JSON.parse(sheet.getRange(2, 3).getValue() || "{}");
    merged = mergeProgress_(previous, progress);
  }
  const row = ["principal", new Date(), JSON.stringify(merged)];
  if (sheet.getLastRow() < 2) sheet.appendRow(row);
  else sheet.getRange(2, 1, 1, 3).setValues([row]);
  return json_({ ok: true });
}

function mergeProgress_(previous, incoming) {
  const mergedMastered = Object.assign({}, previous.mastered || {});
  Object.keys(incoming.mastered || {}).forEach(function(topic) {
    mergedMastered[topic] = Array.from(new Set([
      ...(mergedMastered[topic] || []),
      ...(incoming.mastered[topic] || [])
    ]));
  });

  const previousSteps = previous.completedSteps || [];
  const incomingSteps = incoming.completedSteps || [];
  const latest = new Date(incoming.updatedAt || 0) >= new Date(previous.updatedAt || 0)
    ? incoming
    : previous;

  return Object.assign({}, latest, {
    xp: Math.max(Number(previous.xp) || 0, Number(incoming.xp) || 0),
    streak: Math.max(Number(previous.streak) || 0, Number(incoming.streak) || 0),
    completed: Math.max(Number(previous.completed) || 0, Number(incoming.completed) || 0),
    correct: Math.max(Number(previous.correct) || 0, Number(incoming.correct) || 0),
    mastered: mergedMastered,
    completedSteps: Array.from(new Set(previousSteps.concat(incomingSteps))),
    moduleDone: previous.moduleDone === true || incoming.moduleDone === true,
    updatedAt: new Date().toISOString()
  });
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
