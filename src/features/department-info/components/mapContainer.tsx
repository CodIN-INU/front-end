'use client';
import { useEffect } from 'react';

export default function MapContainer({
  address,
  placename,
}: {
  address: string;
  placename?: string;
}) {
  const isInvalidPlacename = (p: string): boolean => {
    const regex = /^[a-zA-Z0-9가-힣\s]+$/;
    return regex.test(p);
  };

  const initMap = (x: number, y: number) => {
    var map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(x - 0.01, y),
      zoom: 15,
    });

    if (!isInvalidPlacename(placename ?? '')) {
      alert(
        'invalid placename. Please use only alphanumeric characters and spaces.'
      );
      return;
    }

    var marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(x, y),
      map: map,
      icon: {
        content: [
          '<img src="https://map.pstatic.net/resource/api/v2/image/maps/selected-marker/default@1x.png?version=16" alt="마커 이미지" ' +
            'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
            '-webkit-user-select: none; width: 46px; height: 59px; left: 0px; top: 0px;"></img>',
          '<div class="relative ml-[50%]">',
          '<div class="flex flex-col items-center -translate-x-1/2 absolute text-[12px] text-shadow max-w-[120px] min-w-[70px] break-words break-keep text-center">',
          `<div class="absolute text-shadow rounded-[15px]">${placename}</div>`,
          '</div>',
          '</div>',
        ].join(''),
        size: new naver.maps.Size(46, 59),
        anchor: new naver.maps.Point(23, 59),
      },
    });
  };

  useEffect(() => {
    const checkAndInit = () => {
      if (
        !window.naver ||
        !window.naver.maps ||
        !window.naver.maps.Service ||
        !window.naver.maps.Service.geocode
      ) {
        console.warn('naver.maps.Service is not fully ready yet! Retrying...');
        setTimeout(checkAndInit, 300);
        return;
      }

      if (!address || address.trim() === '') {
        console.error('Address is not provided or empty.');
        return;
      }

      tryGeocode();
    };

    const tryGeocode = (retryCount = 0) => {
      if (retryCount > 3) {
        console.error('Geocode failed after multiple retries.');
        return;
      }

      naver.maps.Service.geocode(
        { query: address },
        function (status, response) {
          if (status !== naver.maps.Service.Status.OK) {
            console.error('Geocode error:', response, 'Retrying...');
            setTimeout(() => tryGeocode(retryCount + 1), 500);
            return;
          }

          const result = response.v2;
          const items = result.addresses;

          if (items.length === 0) {
            console.warn('No results found for the address:', address);
            return;
          }

          initMap(Number(items[0].y), Number(items[0].x));
        }
      );
    };

    checkAndInit();
  }, []);

  return (
    address && (
      <>
        <div className="absolute top-0 left-0 right-0 h-[100vh]">
          <div
            id="map"
            className="w-full h-[100vh]"
          ></div>
        </div>
      </>
    )
  );
}
