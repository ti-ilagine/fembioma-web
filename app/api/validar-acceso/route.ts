import { NextResponse } from 'next/server'

// ID de tu Google Sheet en Drive
const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1qNavyUFLKn1su08dgGarUc4-Y6I7iJfW_MlDi_XL4lo/export?format=csv'

export const runtime = 'edge' // Óptimo para Cloudflare Pages

export async function POST(request: Request) {
  try {
    const { correo, codigo } = await request.json()

    if (!correo || !codigo) {
      return NextResponse.json(
        { valido: false, error: 'Correo y código son obligatorios.' },
        { status: 400 }
      )
    }

    const correoBuscado = String(correo).trim().toLowerCase()
    const codigoBuscado = String(codigo).trim().toUpperCase()

    // Si usan la clave maestra de emergencia de TI/Dirección
    if (codigoBuscado === 'FEM26') {
      return NextResponse.json({ valido: true, correo: correoBuscado })
    }

    // Consulta en vivo a la hoja de Google Sheets (con revalidación corta de 60 segundos)
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      return NextResponse.json(
        { valido: false, error: 'No se pudo conectar con el padrón oficial.' },
        { status: 502 }
      )
    }

    const csvText = await response.text()
    const filas = csvText.split('\n')

    // Recorremos las filas del CSV en busca de coincidencia
    let usuarioEncontrado = false

    for (let i = 1; i < filas.length; i++) {
      const fila = filas[i].trim()
      if (!fila) continue

      // Separar columnas respetando posibles comillas
      const columnas = fila.split(',')
      if (columnas.length < 4) continue

      // Estructura: NOMBRE (0), DOCUMENTO (1), CORREO_REGISTRADO (2), CODIGO_ACCESO (3)
      const correoFila = columnas[2].replace(/"/g, '').trim().toLowerCase()
      const codigoFila = columnas[3].replace(/"/g, '').trim().toUpperCase()

      if (correoFila === correoBuscado && codigoFila === codigoBuscado) {
        usuarioEncontrado = true
        break
      }
    }

    if (usuarioEncontrado) {
      return NextResponse.json({ valido: true, correo: correoBuscado })
    }

    return NextResponse.json(
      { valido: false, error: 'El correo o el código de acceso no figuran en el padrón oficial.' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { valido: false, error: 'Error interno validando credenciales.' },
      { status: 500 }
    )
  }
}
