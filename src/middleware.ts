import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/signup',
  '/forgot-password',
  '/_next',
  '/api',
  '/images',
  '/favicon.ico',
]

// Função para verificar se a rota é pública
function isPublicPath(pathname: string): boolean {
  return publicPaths.some((path) => pathname.startsWith(path))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acesso a rotas públicas
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Verificar se existe o cookie de autenticação
  const accessToken = request.cookies.get('access_token')

  // Se não tiver token, redirecionar para login
  if (!accessToken) {
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Se tiver token, permitir acesso
  return NextResponse.next()
}

// Configurar em quais rotas o middleware deve ser executado
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
