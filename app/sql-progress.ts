export type SqlProgress = { module: string; selectIndex: number; selectAnswered: number; selectCorrect: number; filterIndex: number; filterAnswered: number; filterCorrect: number };
export const defaultSqlProgress: SqlProgress = { module: "rdbms", selectIndex: 0, selectAnswered: 0, selectCorrect: 0, filterIndex: 0, filterAnswered: 0, filterCorrect: 0 };
export const sqlProgressKey = "csharp-quest-sql-progress-v1";
export function readSqlProgress(): SqlProgress { if (typeof window === "undefined") return defaultSqlProgress; try { const value = JSON.parse(localStorage.getItem(sqlProgressKey) || "null"); return { ...defaultSqlProgress, ...(value && typeof value === "object" ? value : {}) }; } catch { return defaultSqlProgress; } }
export function writeSqlProgress(progress: SqlProgress) { if (typeof window !== "undefined") localStorage.setItem(sqlProgressKey, JSON.stringify({ ...progress, updatedAt: new Date().toISOString() })); }
