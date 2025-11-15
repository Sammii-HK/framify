import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'

export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }

    return NextResponse.json({
      user: {
        sub: session.user.sub,
        name: session.user.name,
        email: session.user.email,
        picture: session.user.picture,
      },
    })
  } catch (error) {
    console.error('Error getting session:', error)
    return NextResponse.json(
      { error: 'Failed to get session', user: null },
      { status: 500 }
    )
  }
}


