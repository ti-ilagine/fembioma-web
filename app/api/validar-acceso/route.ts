import { NextResponse } from 'next/server'
import { PADRON_GRABACIONES } from '@/lib/padron-grabaciones'

export const runtime = 'edge'

const SHAREPOINT_EXCEL_URL =
  'https://ilagine.sharepoint.com/:x:/s/Fundacin/IQBecBBn47ttSretYmVDIPZ1AXFPKJKChnUM4lICKsNCdXo?download=1'

export async function POST(request: Request) {
  try {
    const { correo, codigo } = await request.json()

    if (!correo || !codigo) {
      return NextResponse.json(
        { valido: false, error: 'Por favor ingrese su correo y código de acceso.' },
        { status: 400 }
      )
    }

    const correoLimpio = String(correo).trim().toLowerCase()
    const codigoLimpio = String(codigo).trim().toUpperCase()

    // 1. Clave maestra de TI / Administración
    if (codigoLimpio === 'FEM26') {
      return NextResponse.json({
        valido: true,
        nombre: 'Coordinación FEMBIOMA',
        correo: correoLimpio,
      })
    }

    // 2. Validación instantánea contra el padrón base (173 participantes en memoria)
    const encontradoLocal = PADRON_GRABACIONES.find(
      (u) =>
        u.correo.toLowerCase() === correoLimpio &&
        u.codigo.toUpperCase() === codigoLimpio
    )

    if (encontradoLocal) {
      return NextResponse.json({
        valido: true,
        nombre: encontradoLocal.nombre,
        correo: encontradoLocal.correo,
      })
    }

    // 3. Consulta en vivo a SharePoint (para altas nuevas agregadas por Fundación)
    try {
      const resSharePoint = await fetch(SHAREPOINT_EXCEL_URL, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        cache: 'no-store',
      })

      if (resSharePoint.ok) {
        const textoPlano = await resSharePoint.text()

        // Búsqueda de coincidencia textual de correo y código en el cuerpo del archivo
        if (
          textoPlano.toLowerCase().includes(correoLimpio) &&
          textoPlano.toUpperCase().includes(codigoLimpio)
        ) {
          return NextResponse.json({
            valido: true,
            nombre: correoLimpio,
            correo: correoLimpio,
          })
        }
      }
    } catch {
      // Si SharePoint demora o tiene microcortes, no bloquea el sistema
    }

    // 4. Si no coincide con ninguna lista
    return NextResponse.json(
      {
        valido: false,
        error:
          'El correo o código de acceso no figuran en el padrón oficial. Si realizó su inscripción recientemente, contacte a eventos@fembioma.com.',
      },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { valido: false, error: 'Error al procesar la autenticación.' },
      { status: 500 }
    )
  }
}
