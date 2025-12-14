import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { projects, tasks } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';
import ProjectDetailClient from '../../../components/dashboard/ProjectDetailClient';
import type { Project, Task } from '@/types';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAuthUser();
  const { id } = await params;
  
  if (!user) {
    redirect('/login');
  }

  // Fetch project
  const projectResult = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.createdBy, user.userId)));

  if (projectResult.length === 0) {
    redirect('/dashboard');
  }

  const project = projectResult[0];

  // Fetch tasks
  const tasksResult = await db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, id))
    .orderBy(desc(tasks.createdAt));

  // Map database results to match interface types
  const mappedProject: Project = {
    id: project.id,
    title: project.title,
    description: project.description || '',
    created_by: project.createdBy || '',
    created_at: project.createdAt?.toISOString() || '',
    updated_at: project.updatedAt?.toISOString() || '',
  };

  const mappedTasks: Task[] = tasksResult.map((task) => ({
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

  return (
    <ProjectDetailClient
      user={user}
      project={mappedProject}
      initialTasks={mappedTasks}
    />
  );
}
