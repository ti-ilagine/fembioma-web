import { NextResponse } from 'next/server'

// Enlace público oficial publicado como CSV en Google Sheets
const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQNWTpkltiWMMuq8H2Ztys4TP0OVzFGO9VJx9zGvo7rW-w6G5EG_cOCtRdBRCmVS_2bsUePFp0oL_vT/pub?output=csv'

export const runtime = 'edge'

// Función para separar columnas CSV respetando comillas en nombres
function splitCsvRow(row: string): string[] {
  const result: string[] = []
  let insideQuote = false
  let entry = ''

  for (let i = 0; i < row.length; i++) {
    const char = row[i]
    if (char === '"') {
      insideQuote = !insideQuote
    } else if (char === ',' && !insideQuote) {
      result.push(entry.trim())
      entry = ''
    } else {
      entry += char
    }
  }
  result.push(entry.trim())
  return result
}

export async function POST(request: Request) {
  try {
    const { correo, codigo } = await request.json()

    if (!correo || !codigo) {
      return NextResponse.json(
        { valido: false, error: 'El correo o el código de acceso no son válidos. Si cree que es un error contacte a eventos@fembioma.com.' },
        { status: 400 }
      )
    }

    const correoBuscado = String(correo).trim().toLowerCase()
    const codigoBuscado = String(codigo).trim().toUpperCase()

    // 1. Clave maestra de TI / Administración
    if (codigoBuscado === 'FEM26') {
      return NextResponse.json({ valido: true, correo: correoBuscado, nombre: 'Coordinación FEMBIOMA' })
    }

    // 2. Consulta en vivo al CSV de Google Sheets (no-store = tiempo real inmediato)
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { valido: false, error: 'El correo o el código de acceso no son válidos. Si cree que es un error contacte a eventos@fembioma.com.' },
        { status: 502 }
      )
    }

    const csvText = await response.text()
    const filas = csvText.split('\n')

    let usuarioEncontrado = false
    let nombreParticipante = ''

    // Recorremos las filas omitiendo la cabecera
    for (let i = 1; i < filas.length; i++) {
      const fila = filas[i].trim()
      if (!fila) continue

      const columnas = splitCsvRow(fila)
      if (columnas.length < 4) continue

      // Estructura: NOMBRE (0), DOCUMENTO (1), CORREO_REGISTRADO (2), CODIGO_ACCESO (3)
      const nombreFila = columnas[0].replace(/"/g, '').trim()
      const correoFila = columnas[2].replace(/"/g, '').trim().toLowerCase()
      const codigoFila = columnas[3].replace(/"/g, '').trim().toUpperCase()

      if (correoFila === correoBuscado && codigoFila === codigoBuscado) {
        usuarioEncontrado = true
        nombreParticipante = nombreFila
        break
      }
    }

    if (usuarioEncontrado) {
      return NextResponse.json({
        valido: true,
        correo: correoBuscado,
        nombre: nombreParticipante || correoBuscado,
      })
    }

    return NextResponse.json(
      { valido: false, error: 'El correo o el código de acceso no son válidos. Si cree que es un error contacte a eventos@fembioma.com.' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { valido: false, error: 'El correo o el código de acceso no son válidos. Si cree que es un error contacte a eventos@fembioma.com.' },
      { status: 500 }
    )
  }
}
