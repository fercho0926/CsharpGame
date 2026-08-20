// Mapa módulo -> ids de lección, en el mismo orden que `steps` en curriculum-data.ts.
// Cada id debe existir exactamente una vez en el arreglo combinado de pasos
// (ver app/lesson-viewer.tsx). El script de validación de contenido
// (scripts/validate-curriculum.ts) verifica esta integridad referencial.
export const lessonMap: Record<string, string[]> = {
 m01:["m01-intro","m01-sdk-cli","m01-console-project","m01-build-run-publish","m01-challenge"],
 m02:["m02-variables","m02-builtins","m02-strings","m02-operators","m02-datetime","m02-conversions","m02-var","m02-challenge"],
 m03:["m03-bool","m03-if","m03-switch","m03-while","m03-dowhile","m03-for","m03-foreach","m03-scope"],
 m04:["m04-declare","m04-return","m04-overload","m04-scope","m04-optional","m04-expression","m04-main","m04-challenge"],
 m05:["m05-create","m05-interpolation","m05-escape","m05-compare","m05-methods","m05-parse","m05-builder","m05-challenge"],
 m06:["m06-class","m06-members","m06-constructors","m06-new","m06-instances","m06-instance-methods","m06-challenge"],
 m07:["m07-value-ref","m07-pass-value","m07-ref-out-in","m07-string-ref","m07-enums","m07-structs","m07-nullable","m07-challenge"],
 m08:["m08-namespace","m08-static","m08-null","m08-gc","m08-library","m08-records","m08-compare","m08-challenge"],
 m09:["m09-array","m09-multi","m09-list","m09-dictionary","m09-hashset","m09-enumerable","m09-choice","m09-challenge"],
 m10:["m10-oop","m10-encapsulation","m10-access","m10-inheritance","m10-derived","m10-isa","m10-composition","m10-challenge"],
 m11:["m11-virtual-override","m11-polymorphism","m11-abstract","m11-interfaces","m11-multi-interface","m11-dip","m11-solid","m11-challenge"],
 m12:["m12-delegates","m12-lambdas","m12-where-select","m12-orderby","m12-first-single-any","m12-groupby-join","m12-deferred","m12-challenge"],
 m13:["m13-exceptions","m13-try-catch-finally","m13-custom-exceptions","m13-file-directory","m13-read-write-text","m13-streams","m13-json","m13-challenge"],
 m14:["m14-task","m14-async-await","m14-cancellation","m14-async-errors","m14-parallel-whenall","m14-race-conditions","m14-configureawait","m14-challenge"],
 m15:["m15-debugger","m15-unit-tests","m15-arrange-act-assert","m15-test-doubles","m15-parameterized-tests","m15-coverage","m15-challenge"],
 n01:["n01-sdk-runtime","n01-csproj","n01-solutions","n01-nuget","n01-dotnet-tool","n01-env-config","n01-build-publish","n01-challenge"],
 n02:["n02-minimal-apis","n02-middleware","n02-routing","n02-model-binding","n02-di","n02-configuration","n02-logging","n02-challenge"],
 n03:["n03-http-rest","n03-status-codes","n03-dtos-validation","n03-openapi","n03-filters","n03-versioning","n03-rate-limiting","n03-challenge"],
 n04:["n04-dbcontext","n04-migrations","n04-relationships","n04-linq-entities","n04-tracking","n04-transactions","n04-efficient-queries","n04-challenge"],
 n05:["n05-authn-authz","n05-identity","n05-jwt","n05-claims-roles","n05-policies","n05-cors-csrf","n05-secrets","n05-challenge"],
 n06:["n06-clean-architecture","n06-solid-services","n06-repository-uow","n06-cqrs","n06-mediatr","n06-options-pattern","n06-observability","n06-challenge"],
 n07:["n07-ihostedservice","n07-backgroundservice","n07-queues","n07-health-checks","n07-domain-events","n07-retries","n07-idempotency","n07-challenge"],
 n08:["n08-allocations-gc","n08-span-memory","n08-caching","n08-efficient-async","n08-benchmarkdotnet","n08-profiling","n08-aot","n08-challenge"],
 n09:["n09-dockerfile","n09-docker-compose","n09-env-vars","n09-cicd","n09-health-probes","n09-prod-logs","n09-azure-app-service","n09-challenge"],
 n10:["n10-webapplicationfactory","n10-integration-tests","n10-testcontainers","n10-mocks-fakes","n10-contract-tests","n10-quality-pipeline","n10-challenge"],
 n11:["n11-csharp-fundamentals","n11-oop-solid","n11-linq-collections","n11-async-concurrency","n11-apis-efcore","n11-architecture","n11-live-coding","n11-final-challenge"],
};
