from __future__ import annotations

from backend.services.report import build_pdf_report


def create_report(payload: dict) -> bytes:
    return build_pdf_report(payload)
