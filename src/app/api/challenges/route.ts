import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany();
    return NextResponse.json(challenges, { status: 200 });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, points, flag } = await req.json();

    if (!title || !description || !points || !flag) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        points,
        flag,
      },
    });

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error('Challenge creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
