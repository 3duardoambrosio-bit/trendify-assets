# Caso administrativo ORDENAL · Criterios y pruebas

Corte fijo: **18 de noviembre de 2026**. Datos **100 % sintéticos**, creados para un ejercicio reproducible. Ningún cliente, equipo o plataforma real intervino.

## Finalidad
Demostrar un flujo de trabajo *de solo lectura* que transforme entradas dispersas en una tabla rastreable, una cola de excepciones y decisiones sujetas a autorización. Esta interfaz no conecta cuentas, no asigna realmente responsables, no procesa cobros ni cambia inventario.

## Fuente de verdad
- `solicitudes_sinteticas.csv`: 32 solicitudes originales, un ID por fila (`SOL-001` a `SOL-032`).
- `reglas_y_limites.json`: seis reglas y corte temporal, con criterio explícito de aplicación.
- `salida_evaluada.json`: clasificación determinista derivada de la entrada, sin efectos externos.
- `assets/admin-case-data.js`: copia de los datos para que la demostración funcione sin un servidor.

## Reglas
1. Sin responsable: campo original vacío. No se inventa titular.
2. Sin soporte: referencia documental vacía. No hay autorización para rellenarla.
3. Vencida: fecha límite **menor o igual** al corte, siempre que la solicitud no esté cerrada.
4. Referencia duplicada: más de una solicitud con el mismo valor en `referencia`. Dos solicitudes pueden corresponder al mismo evento o a eventos distintos; no se fusionan.
5. Dependencia abierta: una dependencia declarada exige cotejo de cierre y autorización; el ejemplo considera todas las solicitudes como no cerradas.
6. Autorización: el escenario declara que se requiere decisión del titular antes de cambiar dinero, publicación o políticas.

Una solicitud puede activar varias reglas; se cuentan por separado `solicitudes con alertas` y `activaciones de reglas`.

## Alcance de la validación
El comprobador `QA_ADMIN_DEMO.py` valida integridad, referencias, recuentos, clasificación y consistencia de archivos. Los ensayos de Chromium validan interacción y presentación; **no** miden tiempos de personal, productividad real, conversiones, ahorros o aceptación de un cliente. Para afirmar mejoras operativas habría que realizar primero una línea base manual y luego un piloto autorizado sobre lotes comparables.

## Restricciones comerciales
- No atribuir el caso a un cliente ni presentar «32 solicitudes procesadas» como experiencia profesional facturada.
- No vender software autónomo, integraciones, decisiones financieras o ejecución en producción a partir de este caso.
- Un responsable humano debe validar fuentes, titularidad y criterios de cierre.
- «Sin alertas» significa **ninguna de las seis reglas se activó**, no aprobación integral.
- ORDENAL es identidad provisional de un profesional independiente; no acreditación de empresa constituida.
