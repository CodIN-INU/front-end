import PartnersClient from './PartnersClient';
import { getPartners } from '@/api/server';

export default async function PartnersRoutePage() {
  const initialPartners = await getPartners();

  return <PartnersClient initialPartners={initialPartners} />;
}
