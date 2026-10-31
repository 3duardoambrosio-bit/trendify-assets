# Eduardo Ambrosio — Interactive Data QA Sample

**Live demo:** https://3duardoambrosio-bit.github.io/trendify-assets/

This is a **synthetic reference exercise**, not paid client work, a live Shopify integration, a production-ready import, a certified QA system, or the production SYNAPSE engine.

## Demonstrated scope

- 180 invented product records; 12 data fields.
- 57 logged findings: 10 safe normalization operations and 47 unresolved incidents.
- 46 records pending owner decision; 10 records adjusted, 124 with no findings.
- Decisions and source/review values for individual records.
- Intentionally **NOT VALIDATED FOR IMPORT**.

## Reproduce file-integrity checks

The repository contains `verify_demo.py`, three CSV files and `04_MANIFIESTO_VERIFICACION.json`. Clone/download them into the same folder and run:

```bash
python verify_demo.py
```

Requires Python 3.8+ standard library. The script verifies SHA-256 digests, file sizes, row mapping and summary counts. **It does not rerun the nine detection rules on arbitrary input, validate real supplier prices, or certify import compatibility.** The files correspond to the downloadable evidence in the demo. The samples are fictitious.

## Scope of service

For paid work, Eduardo and the client agree in writing on source files, columns, rules, deliverables, price, deadline and acceptance conditions before processing. Unresolved values are never guessed. Clients retain control over business decisions and live imports.

Contact: 3duardoambrosio@gmail.com
