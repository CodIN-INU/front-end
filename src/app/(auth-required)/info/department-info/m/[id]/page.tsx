'use client';

import BottomSheet from '@/components/info/partner/bottomSheet';
import MapContainer from '@/components/info/partner/mapContainer';
import BottomNav from '@/components/Layout/BottomNav/BottomNav';
import { use, useEffect, useState } from 'react';
import { IPartner } from '@/interfaces/partners';
import apiClient from '@/api/clients/apiClient';
import Script from 'next/script';
import axios from 'axios';

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
        const { data } = await axios.get(
          `https://codin.inu.ac.kr/api/info/partner/${id}`
        );
        console.log('Fetched partner data:', data.data.location);
        setParter({
          name: data.data.name,
          tags: data.data.tags,
          benefits: data.data.benefits,
          start_date: new Date(data.data.startDate),
          end_date: new Date(data.data.startDate),
          location: data.data.location,
          img: {
            main: data.data.img.main,
            sub: data.data.img.sub || [],
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
