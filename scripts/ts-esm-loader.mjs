// Custom ESM resolve hook used only by scripts/validate-curriculum.ts.
// The app source uses extensionless relative imports (required by the
// Next.js/Vite bundler resolution), but plain Node ESM needs an explicit
// file extension. This hook retries unresolved relative specifiers with
// .ts/.tsx/index.ts appended, so the validator can import app/*.ts content
// modules directly without touching any app source import.
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    const isNotFound = err && err.code === "ERR_MODULE_NOT_FOUND";
    const isRelative = specifier.startsWith(".") || specifier.startsWith("/");
    if (isNotFound && isRelative) {
      for (const ext of [".ts", ".tsx", "/index.ts"]) {
        try {
          return await nextResolve(specifier + ext, context);
        } catch {
          // try next extension
        }
      }
    }
    throw err;
  }
}
