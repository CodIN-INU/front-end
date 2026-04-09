import PartnersClient from './PartnersClient';
import { getPartners } from '@/server';

export default async function PartnersRoutePage() {
  const initialPartners = await getPartners();

  return <PartnersClient initialPartners={initialPartners} />;
}
