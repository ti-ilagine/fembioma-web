import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { correo, codigo, deviceId } = await request.json()

    if (!correo || !codigo) {
      return NextResponse.json(
        { valido: false, error: 'Por favor ingrese su correo y código de acceso.' },
        { status: 400 }
      )
    }

    const correoLimpio = String(correo).trim().toLowerCase()
    const codigoLimpio = String(codigo).trim().toUpperCase()
    const idDispositivo = deviceId ? String(deviceId).trim() : 'dispositivo_generico'

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

    const nuevoToken = crypto.randomUUID()

    // 1. Acceso comodín TI / Soporte (sin límite de dispositivos ni concurrencia)
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

    // 2. Consulta de credenciales en el padrón
    const usuario = await db
      .prepare(
        'SELECT nombre, correo, dispositivos_autorizados FROM participantes WHERE LOWER(correo) = ? AND UPPER(codigo) = ?'
      )
      .bind(correoLimpio, codigoLimpio)
      .first()

    if (usuario) {
      // Parsear lista de dispositivos actuales
      let listaDispositivos: string[] = []
      if (usuario.dispositivos_autorizados) {
        try {
          listaDispositivos = JSON.parse(usuario.dispositivos_autorizados)
        } catch {
          listaDispositivos = []
        }
      }

      // Validar si el dispositivo actual ya está autorizado
      const yaAutorizado = listaDispositivos.includes(idDispositivo)

      if (!yaAutorizado) {
        // Límite de 2 dispositivos por participante
        if (listaDispositivos.length >= 2) {
          return NextResponse.json(
            {
              valido: false,
              error:
                'Has alcanzado el límite máximo permitido de dispositivos autorizados (2). Si cambiaste de equipo o necesitas reasignarlo, contáctanos a eventos@fembioma.com.',
            },
            { status: 403 }
          )
        }

        // Registrar el nuevo dispositivo
        listaDispositivos.push(idDispositivo)
      }

      // Actualizar sesión activa y lista de dispositivos en D1
      await db
        .prepare(
          'UPDATE participantes SET session_token = ?, dispositivos_autorizados = ? WHERE LOWER(correo) = ?'
        )
        .bind(nuevoToken, JSON.stringify(listaDispositivos), usuario.correo)
        .run()

      // Auditoría en registro_accesos
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
