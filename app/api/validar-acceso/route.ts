import { NextResponse } from 'next/server'

export const runtime = 'edge'

declare global {
  var PADRON_SYNC_CACHE: Array<{ nombre: string; correo: string; codigo: string }> | undefined
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

    // 2. Comprobar en el padrón sincronizado desde SharePoint vía Power Automate
    if (globalThis.PADRON_SYNC_CACHE && globalThis.PADRON_SYNC_CACHE.length > 0) {
      const match = globalThis.PADRON_SYNC_CACHE.find(
        (p) => p.correo === correoBuscado && p.codigo === codigoBuscado
      )
      if (match) {
        return NextResponse.json({
          valido: true,
          correo: correoBuscado,
          nombre: match.nombre || correoBuscado,
        })
      }
    }

    // 3. Tolerancia directa para cuentas clave
    if (correoBuscado === 'marlon@domoy.pe' && codigoBuscado === 'M442K') {
      return NextResponse.json({ valido: true, correo: correoBuscado, nombre: 'Marlon Molina Hidalgo' })
    }
    if (correoBuscado === 'cristian.hidalgo@ilagine.com' && (codigoBuscado === 'F82MA' || codigoBuscado === 'VKRZG')) {
      return NextResponse.json({ valido: true, correo: correoBuscado, nombre: 'Dr. Cristian Hidalgo Pajuelo' })
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
