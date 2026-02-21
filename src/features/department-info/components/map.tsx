'use client';
import { Coordinate, NaverMap } from '@/types/map';
import { useCallback, useEffect, useRef } from 'react';

export default function Map({ loc }: { loc: Coordinate }) {
  const mapRef = useRef<NaverMap | null>(null);

  const initMap = (x: number, y: number) => {
    var map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(x, y),
      zoom: 15,
    });

    var mapMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(x, y),
      map: map,
    });
  };

  useEffect(() => {
    naver.maps.Service.geocode(
      {
        query: '여러분이 찾고 싶은 주소',
      },
      function (status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
          return alert('Someting Wrong!');
        }

        const result = response.v2.addresses[0];
        const x = Number(result.x);
        const y = Number(result.y);

        initMap(y, x);
      }
    );
  }, []);

  return (
    <>
      <div
        id="map"
        style={{ width: '100%', height: '100%' }}
      ></div>
    </>
  );
}
