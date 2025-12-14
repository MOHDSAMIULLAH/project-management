import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { analyzeProject } from '@/lib/gemini';
import { db } from '@/lib/db';
import { projects, tasks } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { Task } from '@/types';

const analyzeSchema = z.object({
  project_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { project_id } = analyzeSchema.parse(body);

    // Get project details
    const projectResult = await db
      .select({ title: projects.title })
      .from(projects)
      .where(and(eq(projects.id, project_id), eq(projects.createdBy, user.userId)));

    if (projectResult.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get all tasks for the project
    const tasksResult = await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, project_id))
      .orderBy(desc(tasks.createdAt));

    const project = projectResult[0];
    
    // Map database results to match Task interface
    const tasksList: Task[] = tasksResult.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      status: (task.status || 'todo') as 'todo' | 'in-progress' | 'completed',
      priority: (task.priority || 'medium') as 'low' | 'medium' | 'high',
      estimated_hours: task.estimatedHours ? Number(task.estimatedHours) : null,
      project_id: task.projectId || '',
      created_by: task.createdBy || '',
      created_at: task.createdAt?.toISOString() || '',
      updated_at: task.updatedAt?.toISOString() || '',
    }));

    // Analyze with AI
    const analysis = await analyzeProject(project.title, tasksList);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze project' },
      { status: 500 }
    );
  }
}
