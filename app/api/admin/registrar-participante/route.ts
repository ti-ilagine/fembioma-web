import { NextResponse } from 'next/server'

export const runtime = 'edge'

const CARACTERES = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

function generarCodigoRandom(): string {
  let res = ''
  for (let i = 0; i < 5; i++) {
    res += CARACTERES.charAt(Math.floor(Math.random() * CARACTERES.length))
  }
  return res
}

export async function POST(request: Request) {
  try {
    const { accion, nombre, correo, pinAutorizacion, codigoManual } = await request.json()

    const PIN_VALIDO = 'MARLONDICE'

    if (String(pinAutorizacion).trim() !== PIN_VALIDO) {
      return NextResponse.json(
        { error: 'El PIN de autorización ingresado no es válido.' },
        { status: 403 }
      )
    }

    if (!correo) {
      return NextResponse.json({ error: 'El correo es obligatorio.' }, { status: 400 })
    }

    const correoLimpio = String(correo).trim().toLowerCase()

    const db =
      (process.env as any).DB ||
      (globalThis as any).DB ||
      (globalThis as any).__env__?.DB

    if (!db) {
      return NextResponse.json({ error: 'Error de base de datos.' }, { status: 500 })
    }

    // ACCIÓN 1: CAMBIAR / RESETEAR CLAVE DE ALUMNO EXISTENTE
    if (accion === 'cambiar_clave') {
      const usuario = await db
        .prepare('SELECT nombre FROM participantes WHERE LOWER(correo) = ?')
        .bind(correoLimpio)
        .first()

      if (!usuario) {
        return NextResponse.json(
          { error: 'No se encontró ningún participante registrado con ese correo.' },
          { status: 404 }
        )
      }

      const nuevoCodigo = codigoManual ? String(codigoManual).trim().toUpperCase() : generarCodigoRandom()

      await db
        .prepare('UPDATE participantes SET codigo = ? WHERE LOWER(correo) = ?')
        .bind(nuevoCodigo, correoLimpio)
        .run()

      return NextResponse.json({
        mensaje: '¡Código de acceso actualizado exitosamente!',
        participante: {
          nombre: usuario.nombre,
          correo: correoLimpio,
          codigo: nuevoCodigo,
        },
      })
    }

    // ACCIÓN 2: REGISTRO NORMAL DE NUEVO ALUMNO
    if (!nombre) {
      return NextResponse.json({ error: 'El nombre es obligatorio para registros nuevos.' }, { status: 400 })
    }

    const nombreLimpio = String(nombre).trim()

    const existente = await db
      .prepare('SELECT correo, codigo, nombre FROM participantes WHERE LOWER(correo) = ?')
      .bind(correoLimpio)
      .first()

    if (existente) {
      return NextResponse.json({
        mensaje: 'El correo ya figuraba en el padrón.',
        yaExistia: true,
        participante: {
          nombre: existente.nombre,
          correo: existente.correo,
          codigo: existente.codigo,
        },
      })
    }

    const nuevoCodigo = generarCodigoRandom()

    await db
      .prepare('INSERT INTO participantes (correo, codigo, nombre) VALUES (?, ?, ?)')
      .bind(correoLimpio, nuevoCodigo, nombreLimpio)
      .run()

    return NextResponse.json({
      mensaje: '¡Alumno registrado exitosamente!',
      yaExistia: false,
      participante: {
        nombre: nombreLimpio,
        correo: correoLimpio,
        codigo: nuevoCodigo,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Error interno de servidor.' }, { status: 500 })
  }
}
