import { NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

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

    // Clave de contingencia de soporte / TI
    if (codigoLimpio === 'FEM26') {
      return NextResponse.json({
        valido: true,
        nombre: 'Coordinación FEMBIOMA',
        correo: correoLimpio,
      })
    }

    // Consulta en milisegundos a Cloudflare D1
    const { env } = getRequestContext()
    const db = (env as any).DB

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
        error: 'El correo o código ingresado no figura en el padrón activo. Contacte a soporte.',
      },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { valido: false, error: 'Error interno al validar credenciales.' },
      { status: 500 }
    )
  }
}
