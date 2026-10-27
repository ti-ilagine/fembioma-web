import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { correo } = await request.json()

    if (!correo) {
      return NextResponse.json(
        { exito: false, error: 'Por favor ingrese su correo electrónico.' },
        { status: 400 }
      )
    }

    const correoLimpio = String(correo).trim().toLowerCase()

    // Conexión directa a Cloudflare D1 en Edge
    const db =
      (process.env as any).DB ||
      (globalThis as any).DB ||
      (globalThis as any).__env__?.DB

    if (!db) {
      return NextResponse.json(
        { exito: false, error: 'Error de conexión con la base de datos.' },
        { status: 500 }
      )
    }

    // Consulta en la tabla oficial de D1
    const usuario = await db
      .prepare('SELECT nombre, correo, codigo FROM participantes WHERE LOWER(correo) = ?')
      .bind(correoLimpio)
      .first()

    if (!usuario) {
      return NextResponse.json(
        {
          exito: false,
          error: 'El correo ingresado no figura en el padrón activo. Contacte a eventos@fembioma.com.',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      exito: true,
      nombre: usuario.nombre,
      correo: usuario.correo,
      codigo: usuario.codigo,
    })
  } catch (error) {
    return NextResponse.json(
      { exito: false, error: 'Error interno al consultar el padrón.' },
      { status: 500 }
    )
  }
}
