import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateRecommendations } from '@/lib/ai/services';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate recommendations for the user
    const recommendations = await generateRecommendations(session.user.email || 'anonymous');

    return NextResponse.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
