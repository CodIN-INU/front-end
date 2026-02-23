'use client';

import BottomSheet from '@/features/department-info/components/bottomSheet';
import MapContainer from '@/features/department-info/components/mapContainer';
import BottomNav from '@/components/Layout/BottomNav/BottomNav';
import { use, useEffect, useState } from 'react';
import { IPartner } from '@/types/partners';
import Script from 'next/script';
import { fetchClient } from '@/shared/api/fetchClient';

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? '';

export default function MapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [partner, setParter] = useState<IPartner | null>(null);

  useEffect(() => {
    if (!id) {
      console.error('Query parameter "id" is missing');
      return;
    }

    console.log('Fetching partner data for ID:', id);

    const fetchPartner = async () => {
      try {
        const { data } = await fetchClient(`/info/partner/${id}`);
        console.log('Fetched partner data:', data.location);
        setParter({
          name: data.name,
          tags: data.tags,
          benefits: data.benefits,
          start_date: new Date(data.startDate),
          end_date: new Date(data.startDate),
          location: data.location,
          img: {
            main: data.img.main,
            sub: data.img.sub || [],
          },
        });
      } catch (error) {
        console.error('Error fetching partner data:', error);
      }
    };
    fetchPartner();
  }, []);

  return (
    <>
      {/* 지도 페이지에서만 네이버맵 로드 (lazyOnload로 렌더 차단 없음) */}
      {NAVER_MAP_CLIENT_ID && (
        <>
          <Script
            strategy="lazyOnload"
            src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
          />
          <Script
            strategy="lazyOnload"
            src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`}
          />
        </>
      )}
      {partner && (
        <>
          <MapContainer
            key={partner.location}
            address={partner.location}
            placename={partner.name}
          />
          <BottomSheet
            title={partner.name}
            tags={partner.tags}
            duration={[
              new Date(partner.start_date),
              new Date(partner.end_date),
            ]}
            timeDescription={'1학기 시작 전까지'}
            benefits={partner.benefits}
            img={partner.img.sub}
          />
        </>
      )}
      <BottomNav />
    </>
  );
}
