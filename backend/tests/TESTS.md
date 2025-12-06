# Documentación de Tests y Metricas

Este documento resume las pruebas unitarias añadidas en `backend/tests`, cómo ejecutarlas, qué miden y cómo extenderlas.

## Pruebas

- Archivos actuales:
  
  - `auth.test.js` — pruebas para el middleware `protect`.
  - `restrictTo.test.js` — pruebas para el middleware `restrictTo`.
  - `protectLogging.test.js` — verifica que `protect` registre errores cuando falta token.
  - `errorHandler.test.js` — pruebas para `AppError` y `errorHandler`.

## Objetivo

- Proveer tests rápidos y deterministas que:

  - Verifiquen lógica de autenticación y autorización (sin usar la base de datos).
  - Confirmen comportamiento del manejador de errores.

## Ejecutar tests

Desde la carpeta `backend` ejecutar:

``` bash
cd "./Proyecto/backend"
npm test
```

Salida esperada (ejemplo):

``` bash
ℹ tests 8
ℹ pass 8
ℹ fail 0
```

## Qué mide cada test

- `auth.test.js`: comprueba que `protect`:
  - retorne `AppError` 401 cuando falta token,
  - retorne `AppError` 401 cuando `jwt.verify` falla,
  - setee `req.user` cuando el token es válido.
- `restrictTo.test.js`: comprueba que `restrictTo` permita roles válidos y rechace con 403 roles no permitidos.
- `protectLogging.test.js`: asegura que `protect` registra (console.error) cuando falta token (se silencia el log durante el test).
- `errorHandler.test.js`: valida que `AppError` tenga `statusCode` e `isOperational` y que `errorHandler` devuelva JSON con `success:false` y `message`.

## Patrones y buenas prácticas usadas

- Runner: usamos el runner integrado de Node (`node --test`).
- Mocking ligero: para `jwt.verify` se expuso una indirection (`__setJwtVerify`) en `middleware/auth.js` para inyectar comportamiento en tests sin mutar módulos.
- Middlewares: crear `req` y `res` simples (solo con propiedades necesarias) y `next` como función que captura `err`.

## `npm run lint` — Metrica desarrollo

`npm run lint` ejecuta ESLint sobre el código del backend y mide problemas de calidad estática (errores de sintaxis, malas prácticas, uso inseguro de APIs, variables sin usar, problemas de estilo cuando ESLint está configurado para ello).

- Qué hace:
  - Analiza archivos `.js` en el proyecto y reporta **errors** (fallos que deberían corregirse) y **warnings** (problemas que conviene revisar).
  - Detecta problemas de mantenimiento (por ejemplo variables no usadas, funciones muy complejas o bloques unreachable) y reglas configuradas en `.eslintrc.json`.
  - Puede arreglar automáticamente ciertos problemas con la opción `--fix`.

- Comandos útiles:
  - Ejecutar lint: `npm run lint` (ya está definido en `package.json`).
  - Arreglar automáticamente lo que ESLint puede: `npm run lint:fix`.
  - Ejecutar sólo sobre archivos cambiados o directorios específicos: `npx eslint src/ controllers/`.

- Ejemplo de salida y cómo interpretarla:
  
```  console
path/to/file.js
  10:5  error  'x' is defined but never used  no-unused-vars
  28:13 warning  Unexpected console statement  no-console

✖ 1 problem (1 error, 1 warning)
```

- Cómo arreglar los problemas que `eslint` detecta:
  1. Ejecuta `npm run lint` para ver la lista.
  2. Corre `npm run lint:fix` para que ESLint arregle lo que pueda.
  3. Revisa manualmente el resto (warnings y errores no arreglables automáticamente).
  
## SonarQube Extension — Análisis de Calidad de Código

SonarQube es una extensión de VS Code que analiza tu código en tiempo real (mientras escribes) y detecta problemas de calidad, bugs potenciales, vulnerabilidades de seguridad y code smells (problemas de diseño/mantenimiento).

### Qué detecta SonarQube:

- **Bugs potenciales**: código que puede fallar en runtime (p. ej. acceso a propiedades nulas, lógica defectuosa).
- **Vulnerabilidades de seguridad**: código inseguro (p. ej. hardcoding de secretos, uso de funciones peligrosas).
- **Code Smells**: problemas de mantenimiento (p. ej. funciones muy largas, duplicación de código, variables sin usar).
- **Exceptions ignoradas**: regla S2486 — cuando un `catch` recibe una excepción pero no la usa ni loguea (es lo que viste en `auth.js`).
- **Mantenibilidad**: complejidad ciclomática, tamaño de métodos, etc.

### Niveles de severidad en SonarQube:

- **Blocker** (rojo): bloquea despliegue, debe arreglarse ya.
- **Critical** (rojo): problema de seguridad o bug grave, arreglar pronto.
- **Major** (naranja): code smell o problema de mantenimiento, arreglar antes de mergear.
- **Minor** (amarillo): sugerencia, mejorar cuando sea posible.
- **Info** (azul): recomendación, útil para aprender.
