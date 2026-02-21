/**
 * 서버에서 학과/파트너/교수 정보 조회 (SSR용)
 */

import { serverFetch } from './serverFetch';

/** 제휴사 목록: /info/partner */
export async function getPartners(): Promise<any[]> {
  try {
    const res = await serverFetch<{ dataList?: any[] }>('/info/partner');
    return Array.isArray(res.dataList) ? res.dataList : [];
  } catch {
    return [];
  }
}

/** 제휴사 상세: /info/partner/:id */
export async function getPartnerById(
  id: string | string[]
): Promise<{
  name: string;
  tags: string[];
  benefits: string[];
  location: string;
  startDate: string;
  img: { main: string; sub?: string[] };
} | null> {
  const partnerId = Array.isArray(id) ? id[0] : String(id ?? '');
  if (!partnerId) return null;
  try {
    const res = await serverFetch<{ data?: any }>(`/info/partner/${partnerId}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

/** 학과 사무실 정보: /info/office/:departmentName */
export async function getOfficeByDepartment(
  departmentName: string
): Promise<{
  data: {
    img: string;
    officeNumber: string;
    fax: string;
    location: string;
    open: string;
    vacation: string;
    officeMember: Array<{
      name: string;
      position: string;
      number: string;
      email: string;
    }>;
  };
} | null> {
  if (!departmentName) return null;
  try {
    const res = await serverFetch<{ success?: boolean; data?: any }>(
      `/info/office/${departmentName}`
    );
    if (res.success !== false && res.data) {
      return { data: res.data };
    }
    return null;
  } catch {
    return null;
  }
}

/** 교수/연구실 목록: /info/lab */
export async function getProfessorLabList(): Promise<any[]> {
  try {
    const res = await serverFetch<{ success?: boolean; dataList?: any[] }>(
      '/info/lab'
    );
    return Array.isArray(res.dataList) ? res.dataList : [];
  } catch {
    return [];
  }
}
