// C# Quest → Google Sheets
// 1. Crea una hoja de cálculo nueva.
// 2. Extensiones → Apps Script.
// 3. Pega este archivo y cambia SHEET_ID por el ID de tu hoja.
// 4. Implementar → Nueva implementación → Aplicación web.
// 5. Ejecutar como tú y permitir acceso a cualquiera con el enlace.
const SHEET_ID = "PEGA_AQUI_EL_ID_DE_TU_HOJA";
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

function doGet() { return json_({ ok: true, app: "C# Quest" }); }
function doGet(e) {
  if (e && e.parameter && e.parameter.action === "progress") {
    const sheet = getProgressSheet_();
    if (sheet.getLastRow() < 2) return json_({ ok: true, progress: null });
    return json_({ ok: true, progress: JSON.parse(sheet.getRange(2, 3).getValue() || "null") });
  }
  return json_({ ok: true, app: "C# Quest" });
}

function getSheet_() {

  function getProgressSheet_() {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName("Progreso") || spreadsheet.insertSheet("Progreso");
    if (sheet.getLastRow() === 0) sheet.appendRow(["Clave", "Fecha", "Estado JSON"]);
    return sheet;
  }

  function saveProgress_(progress) {
    const sheet = getProgressSheet_();
    const row = ["principal", new Date(), JSON.stringify(progress)];
    if (sheet.getLastRow() < 2) sheet.appendRow(row);
    else sheet.getRange(2, 1, 1, 3).setValues([row]);
    return json_({ ok: true });
  }
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  return spreadsheet.getSheetByName(TAB_NAME) || spreadsheet.insertSheet(TAB_NAME);
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
