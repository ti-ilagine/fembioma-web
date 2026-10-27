import { NextResponse } from 'next/server'

// Token secreto para que solo tu Power Automate pueda enviar datos
const SECRET_SYNC_TOKEN = 'FEMBIOMA_ILAGINE_SYNC_2026_TOKEN'

// Variable en memoria global para el Edge Runtime
declare global {
  var PADRON_SYNC_CACHE: Array<{ nombre: string; correo: string; codigo: string }> | undefined
}

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${SECRET_SYNC_TOKEN}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { participantes } = await request.json()

    if (!Array.isArray(participantes)) {
      return NextResponse.json({ error: 'Formato inválido' }, { status: 400 })
    }

    // Normalizar datos
    globalThis.PADRON_SYNC_CACHE = participantes.map((p: any) => ({
      nombre: String(p.NOMBRE || p.nombre || '').trim(),
      correo: String(p.CORREO_REGISTRADO || p.correo || '').trim().toLowerCase(),
      codigo: String(p.CODIGO_ACCESO || p.codigo || '').trim().toUpperCase(),
    }))

    return NextResponse.json({
      success: true,
      total: globalThis.PADRON_SYNC_CACHE.length,
      mensaje: 'Padrón actualizado exitosamente desde SharePoint',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error al sincronizar' }, { status: 500 })
  }
}
