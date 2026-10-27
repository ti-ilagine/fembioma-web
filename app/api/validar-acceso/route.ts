import { NextResponse } from 'next/server'

export const runtime = 'edge'

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

    // Acceso comodín de soporte / TI
    if (codigoLimpio === 'FEM26') {
      return NextResponse.json({
        valido: true,
        nombre: 'Coordinación FEMBIOMA',
        correo: correoLimpio,
      })
    }

    // Obtención del binding D1 compatible con Cloudflare Pages Edge
    const db =
      (process.env as any).DB ||
      (globalThis as any).DB ||
      (globalThis as any).__env__?.DB

    if (!db) {
      return NextResponse.json(
        { valido: false, error: 'Error de configuración en base de datos.' },
        { status: 500 }
      )
    }

    const usuario = await db
      .prepare(
        'SELECT nombre, correo FROM participantes WHERE LOWER(correo) = ? AND UPPER(codigo) = ?'
      )
      .bind(correoLimpio, codigoLimpio)
      .first()

    if (usuario) {
      return NextResponse.json({
        valido: true,
        nombre: usuario.nombre,
        correo: usuario.correo,
      })
    }

    return NextResponse.json(
      {
        valido: false,
        error: 'El correo o el código de acceso no son válidos. Si cree que es un error contacte a eventos@fembioma.com.',
      },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { valido: false, error: 'Error interno de validación.' },
      { status: 500 }
    )
  }
}
