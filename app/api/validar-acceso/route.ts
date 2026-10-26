import { NextResponse } from 'next/server'

const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1qNavyUFLKn1su08dgGarUc4-Y6I7iJfW_MlDi_XL4lo/export?format=csv'

export const runtime = 'edge'

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

    // Acceso administrativo de emergencia
    if (codigoBuscado === 'FEM26') {
      return NextResponse.json({ valido: true, correo: correoBuscado, nombre: 'Equipo de Coordinación' })
    }

    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      next: { revalidate: 60 }
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

    for (let i = 1; i < filas.length; i++) {
      const fila = filas[i].trim()
      if (!fila) continue

      const columnas = fila.split(',')
      if (columnas.length < 4) continue

      // Columnas: NOMBRE (0), DOCUMENTO (1), CORREO_REGISTRADO (2), CODIGO_ACCESO (3)
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
        nombre: nombreParticipante || correoBuscado
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
