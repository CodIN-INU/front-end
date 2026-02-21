import ProfessorClient from './ProfessorClient';
import { getProfessorLabList } from '@/api/server';

export default async function ProfessorRoutePage() {
  const initialPosts = await getProfessorLabList();

  return <ProfessorClient initialPosts={initialPosts} />;
}
