import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { challengeId, flag } = await req.json();

    if (!challengeId || !flag) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge not found' },
        { status: 404 }
      );
    }

    if (challenge.flag === flag) {
      const submission = await prisma.submission.create({
        data: {
          userId: session.user.id,
          challengeId,
        },
      });
      return NextResponse.json(submission, { status: 201 });
    } else {
      return NextResponse.json(
        { message: 'Incorrect flag' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
