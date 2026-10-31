from pathlib import Path
import csv
import hashlib
import json
import sys

BASE = Path(__file__).resolve().parent
MANIFEST = json.loads((BASE / "04_MANIFIESTO_VERIFICACION.json").read_text(encoding="utf-8"))

def rows(name):
    with (BASE / name).open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))

def verify():
    for name, expected in MANIFEST["files"].items():
        data = (BASE / name).read_bytes()
        digest = hashlib.sha256(data).hexdigest()
        if digest != expected["sha256"] or len(data) != expected["bytes"]:
            raise ValueError(f"Failed checksum or size verification: {name}")
    source = rows("01_FUENTE_ORIGINAL.csv")
    reviewed = rows("02_REVISION_PROPUESTA.csv")
    incidents = rows("03_BITACORA_INCIDENCIAS.csv")
    checks = MANIFEST["summary"]
    if len(source) != len(reviewed) or len(source) != checks["records"]:
        raise ValueError("Record count mismatch")
    if len(incidents) != checks["incidences"]:
        raise ValueError("Issue count mismatch")
    if sum(x["decision"] == "PENDIENTE" for x in incidents) != checks["pending_incidents"]:
        raise ValueError("Pending issue count mismatch")
    if sum(x["decision"] == "NORMALIZADO" for x in incidents) != checks["safe_changes"]:
        raise ValueError("Normalization count mismatch")
    if [x["record_id"] for x in source] != [x["record_id"] for x in reviewed]:
        raise ValueError("Source/review row mapping mismatch")
    print("PASS — SHA-256, lengths, row mapping, and issue totals verified")

if __name__ == "__main__":
    try:
        verify()
    except (OSError, ValueError, KeyError) as exc:
        print(f"FAIL — {exc}", file=sys.stderr)
        sys.exit(1)
