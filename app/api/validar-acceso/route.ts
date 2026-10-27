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

    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for') ||
      'desconocida'

    // Generar identificador de sesión único
    const nuevoToken = crypto.randomUUID()

    // 1. Acceso comodín TI / Soporte (FEM26 no se pisa a sí mismo)
    if (codigoLimpio === 'FEM26') {
      await db
        .prepare('INSERT INTO registro_accesos (correo, nombre, ip) VALUES (?, ?, ?)')
        .bind(correoLimpio, 'Soporte TI (FEM26)', ip)
        .run()

      return NextResponse.json({
        valido: true,
        nombre: 'Coordinación FEMBIOMA',
        correo: correoLimpio,
        sessionToken: 'MASTER_BYPASS',
      })
    }

    // 2. Consulta de credenciales en el padrón oficial
    const usuario = await db
      .prepare(
        'SELECT nombre, correo FROM participantes WHERE LOWER(correo) = ? AND UPPER(codigo) = ?'
      )
      .bind(correoLimpio, codigoLimpio)
      .first()

    if (usuario) {
      // Guardar nuevo session_token en D1 (invalida automáticamente sesiones anteriores)
      await db
        .prepare('UPDATE participantes SET session_token = ? WHERE LOWER(correo) = ?')
        .bind(nuevoToken, usuario.correo)
        .run()

      // Auditoría de ingreso
      await db
        .prepare('INSERT INTO registro_accesos (correo, nombre, ip) VALUES (?, ?, ?)')
        .bind(usuario.correo, usuario.nombre, ip)
        .run()

      return NextResponse.json({
        valido: true,
        nombre: usuario.nombre,
        correo: usuario.correo,
        sessionToken: nuevoToken,
      })
    }

    return NextResponse.json(
      {
        valido: false,
        error:
          'El correo o el código de acceso no son válidos. Si cree que es un error contacte a eventos@fembioma.com.',
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
