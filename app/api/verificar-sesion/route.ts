import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { correo, sessionToken } = await request.json()

    if (!correo || !sessionToken) {
      return NextResponse.json({ activa: false }, { status: 401 })
    }

    // El token comodín de soporte nunca expira
    if (sessionToken === 'MASTER_BYPASS') {
      return NextResponse.json({ activa: true })
    }

    const db =
      (process.env as any).DB ||
      (globalThis as any).DB ||
      (globalThis as any).__env__?.DB

    if (!db) {
      return NextResponse.json({ activa: true })
    }

    const usuario = await db
      .prepare('SELECT session_token FROM participantes WHERE LOWER(correo) = ?')
      .bind(String(correo).trim().toLowerCase())
      .first()

    // Si el token almacenado en D1 cambió, significa que alguien inició sesión después
    if (usuario && usuario.session_token === sessionToken) {
      return NextResponse.json({ activa: true })
    }

    return NextResponse.json({ activa: false })
  } catch {
    return NextResponse.json({ activa: true })
  }
}
