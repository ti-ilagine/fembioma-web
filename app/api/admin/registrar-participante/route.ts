import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Alfabeto seguro sin caracteres ambiguos (sin 0, O, 1, I)
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
    const { nombre, correo, pinAutorizacion } = await request.json()

    if (!nombre || !correo || !pinAutorizacion) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios.' },
        { status: 400 }
      )
    }

    // PIN de ventas exclusivo para el equipo administrativo (puedes cambiarlo)
    const PIN_VALIDO = 'MARLONDICE'

    if (String(pinAutorizacion).trim() !== PIN_VALIDO) {
      return NextResponse.json(
        { error: 'El PIN de autorización ingresado no es válido.' },
        { status: 403 }
      )
    }

    const correoLimpio = String(correo).trim().toLowerCase()
    const nombreLimpio = String(nombre).trim()

    // Conexión directa a Cloudflare D1
    const db =
      (process.env as any).DB ||
      (globalThis as any).DB ||
      (globalThis as any).__env__?.DB

    if (!db) {
      return NextResponse.json(
        { error: 'Error de conexión con la base de datos.' },
        { status: 500 }
      )
    }

    // 1. Verificar si el correo ya cuenta con acceso
    const existente = await db
      .prepare('SELECT correo, codigo, nombre FROM participantes WHERE LOWER(correo) = ?')
      .bind(correoLimpio)
      .first()

    if (existente) {
      return NextResponse.json({
        mensaje: 'El correo ya se encontraba registrado previamente.',
        yaExistia: true,
        participante: {
          nombre: existente.nombre,
          correo: existente.correo,
          codigo: existente.codigo,
        },
      })
    }

    // 2. Generar código de 5 caracteres único
    const nuevoCodigo = generarCodigoRandom()

    // 3. Insertar en D1
    await db
      .prepare(
        'INSERT INTO participantes (correo, codigo, nombre) VALUES (?, ?, ?)'
      )
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
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno al registrar participante en el padrón.' },
      { status: 500 }
    )
  }
}
