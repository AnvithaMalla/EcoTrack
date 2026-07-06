from __future__ import annotations

import io
from datetime import datetime
from typing import Any

from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.lineplots import LinePlot
from reportlab.graphics.shapes import Drawing, String
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from backend.services.carbon import equivalent_metrics


styles = getSampleStyleSheet()


def build_pdf_report(payload: dict[str, Any]) -> bytes:
    buffer = io.BytesIO()
    document = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=16 * mm, leftMargin=16 * mm, topMargin=16 * mm, bottomMargin=16 * mm)
    story = []

    story.append(Paragraph('EcoTrack Carbon Report', styles['Title']))
    story.append(Paragraph(f"Generated {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}", styles['Normal']))
    story.append(Spacer(1, 8))

    stats = payload.get('stats', {})
    budget = payload.get('budget', 7)
    total = float(payload.get('totalEmission', 0))
    equivalents = equivalent_metrics(total)

    summary_table = Table([
        ['Metric', 'Value'],
        ['Total emissions', f"{total:.2f} kg CO2e"],
        ['Daily budget', f"{float(budget):.2f} kg CO2e"],
        ['Budget remaining', f"{float(payload.get('budgetRemaining', budget - total)):.2f} kg CO2e"],
        ['Current streak', f"{stats.get('currentStreak', 0)} days"],
        ['Longest streak', f"{stats.get('longestStreak', 0)} days"],
        ['Equivalent trees planted', f"{equivalents['treesPlanted']:.2f}"],
        ['Equivalent km driven', f"{equivalents['kilometersDriven']:.2f}"],
        ['Equivalent smartphone charges', f"{equivalents['smartphoneCharges']:.2f}"],
    ], colWidths=[75 * mm, 90 * mm])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0b1320')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#d5dfeb')),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fbff')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.HexColor('#eef5f0')]),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 12))

    story.append(Paragraph('Breakdown', styles['Heading2']))
    story.append(_bar_chart(payload))
    story.append(Spacer(1, 12))
    story.append(Paragraph('Trend', styles['Heading2']))
    story.append(_line_chart(payload.get('history', [])))
    story.append(Spacer(1, 12))

    story.append(Paragraph('Suggestions', styles['Heading2']))
    suggestions = payload.get('suggestions', [])
    for suggestion in suggestions[:3]:
        story.append(Paragraph(f"<b>{suggestion.get('title', 'Suggestion')}</b>", styles['BodyText']))
        story.append(Paragraph(suggestion.get('description', ''), styles['BodyText']))
        story.append(Paragraph(f"Estimated savings: {float(suggestion.get('estimated_savings', 0)):.2f} kg CO2e", styles['BodyText']))
        story.append(Spacer(1, 6))

    document.build(story)
    return buffer.getvalue()


def _bar_chart(payload: dict[str, Any]) -> Drawing:
    drawing = Drawing(500, 160)
    chart = VerticalBarChart()
    chart.x = 35
    chart.y = 20
    chart.height = 110
    chart.width = 430
    chart.data = [[float(payload.get('travel', {}).get('emission', 0)), float(payload.get('food', {}).get('emission', 0)), float(payload.get('energy', {}).get('emission', 0))]]
    chart.categoryAxis.categoryNames = ['Travel', 'Food', 'Energy']
    chart.barLabels.fontSize = 8
    chart.bars[0].fillColor = colors.HexColor('#15a473')
    chart.bars[1].fillColor = colors.HexColor('#f98a12')
    chart.bars[2].fillColor = colors.HexColor('#35506d')
    chart.valueAxis.valueMin = 0
    chart.valueAxis.labels.fontSize = 8
    drawing.add(chart)
    drawing.add(String(35, 140, 'Category emissions (kg CO2e)', fontSize=10, fillColor=colors.HexColor('#0b1320')))
    return drawing


def _line_chart(history: list[dict[str, Any]]) -> Drawing:
    drawing = Drawing(500, 180)
    chart = LinePlot()
    chart.x = 45
    chart.y = 25
    chart.height = 120
    chart.width = 420
    points = [(index + 1, float(item.get('totalEmission', 0))) for index, item in enumerate(history[-14:])]
    if not points:
        points = [(1, 0), (2, 0)]
    chart.data = [points]
    chart.lines[0].strokeColor = colors.HexColor('#15a473')
    chart.lines[0].symbol = None
    chart.xValueAxis.valueMin = 1
    chart.xValueAxis.valueMax = max(2, len(points))
    chart.yValueAxis.valueMin = 0
    drawing.add(chart)
    drawing.add(String(45, 150, 'Trend view', fontSize=10, fillColor=colors.HexColor('#0b1320')))
    return drawing
