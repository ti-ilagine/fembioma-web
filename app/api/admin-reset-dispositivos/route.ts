import { NextResponse } from 'next/server'

export const runtime = 'edge'

const PIN_ADMIN = 'VENTAS2026'

export async function POST(request: Request) {
  try {
    const { correo, pin } = await request.json()

    if (!correo || !pin) {
      return NextResponse.json(
        { exito: false, error: 'Faltan parámetros requeridos.' },
        { status: 400 }
      )
    }

    if (pin !== PIN_ADMIN) {
      return NextResponse.json(
        { exito: false, error: 'PIN administrativo incorrecto.' },
        { status: 403 }
      )
    }

    const correoLimpio = String(correo).trim().toLowerCase()

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

    const res = await db
      .prepare(
        'UPDATE participantes SET dispositivos_autorizados = NULL, session_token = NULL WHERE LOWER(correo) = ?'
      )
      .bind(correoLimpio)
      .run()

    if (res.meta?.changes === 0) {
      return NextResponse.json(
        { exito: false, error: 'El correo no se encontró en la base de datos.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      exito: true,
      mensaje: `Dispositivos desvinculados exitosamente para ${correoLimpio}.`,
    })
  } catch (error) {
    return NextResponse.json(
      { exito: false, error: 'Error interno al resetear dispositivos.' },
      { status: 500 }
    )
  }
}
