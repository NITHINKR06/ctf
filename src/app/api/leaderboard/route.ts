import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  flag: string;
}

interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  challenge: Challenge;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: 'USER' | 'ADMIN';
  submissions: Submission[];
}

export async function GET() {
  try {
    const users: User[] = await prisma.user.findMany({
      include: {
        submissions: {
          include: {
            challenge: true,
          },
        },
      },
    });

    const leaderboard = users
      .map((user) => {
        const totalPoints = user.submissions.reduce(
          (sum, submission) => sum + submission.challenge.points,
          0
        );
        return {
          id: user.id,
          name: user.name,
          totalPoints,
        };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
