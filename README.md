# ORDENAL — Operaciones, datos y decisiones comerciales

**Sitio público:** https://3duardoambrosio-bit.github.io/trendify-assets/  
**Consultar un caso:** https://3duardoambrosio-bit.github.io/trendify-assets/consulta.html

ORDENAL es una presentación de **servicios profesionales independientes** a cargo de Eduardo Ambrosio, en México. Su enfoque es investigar problemas operativos, revisar información, documentar diferencias y acordar criterios claros de decisión y aceptación antes de intervenir.

## Áreas de trabajo

- Administración y continuidad operativa
- Inteligencia e investigación comercial
- Ecommerce y operación de producto
- Crecimiento y operaciones comerciales
- Datos y control de calidad

El sitio muestra situaciones de trabajo, capacidades con límites explícitos y **demostraciones sintéticas**. La existencia de una ficha de capacidad no implica experiencia comercial acreditada en esa área ni autoriza cambios en sistemas de terceros.

## Demostración técnica de referencia: QA de catálogo

Este repositorio conserva una muestra ficticia de control de datos, **no un caso pagado de cliente, integración activa con Shopify, importación lista para producción, sistema de QA certificado ni motor SYNAPSE en producción**.

La muestra documentada incluye:

- **180 registros ficticios** de productos y 12 campos.
- **57 hallazgos**: 10 operaciones de normalización segura y 47 incidencias sin resolver.
- **46 registros** pendientes de decisión del responsable, 10 registros ajustados y 124 sin hallazgos.
- Evidencia de valores de origen, revisión y decisiones por registro.
- Estado deliberado: **NO VALIDADO PARA IMPORTACIÓN**.

### Reproducir la integridad de archivos

El repositorio contiene `verify_demo.py`, tres CSV y `04_MANIFIESTO_VERIFICACION.json`. Descárgalos en la misma carpeta y ejecuta:

```bash
python verify_demo.py
```

Requiere Python 3.8+ y su biblioteca estándar. El script comprueba hashes SHA-256, tamaños, correspondencias de filas y conteos resumidos. **No vuelve a ejecutar las nueve reglas de detección sobre archivos arbitrarios, no valida precios reales de proveedores y no certifica compatibilidad de importación.** Todos los datos de ejemplo son ficticios.

## Cómo se trabaja con un cliente

Antes de cualquier trabajo pagado, Eduardo y el cliente acuerdan por escrito las fuentes, campos, reglas, alcance, entregables, precio, plazo y condiciones de aceptación. Los valores sin resolver no se inventan y las decisiones comerciales, autorizaciones y cargas en sistemas reales permanecen bajo control del cliente.

**Este repositorio aloja la presentación pública y demostraciones acotadas de ORDENAL. No publica ni acredita un motor autónomo de producción.**

**Contacto:** 3duardoambrosio@gmail.com
