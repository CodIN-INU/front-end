'use client';
// 정보대 소개 페이지
import React, { useState, useEffect, act } from 'react';
import axios from 'axios';
import Tabs from '@/components/Layout/Tabs';
import Link from 'next/link';
import Header from '@/components/Layout/header/Header'; // Link 추가
import DefaultBody from '@/components/Layout/Body/defaultBody';
import BottomNav from '@/components/Layout/BottomNav/BottomNav';
import { Tags, OtherTag } from '@/components/info/partner/tag';
import type { IPartners } from '@/interfaces/partners';
import { set } from 'lodash';
import apiClient from '@/api/clients/apiClient';
import { PartnerLinkCard } from '@/components/info/partner/PartnerLinkCard';

export default function DepartmentInfoPage() {
  const [activeTab, setActiveTab] = useState('phoneDirectory');
  const [professorPosts, setProfessorPosts] = useState([]); // 교수님 및 연구실 데이터 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [partners, setPartners] = useState<IPartners[]>([]); // 제휴 업체 데이터 상태

  const navigateToMain = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/main';
    }
  };

  const tabs = [
    { label: '전화번호부', value: 'phoneDirectory' },
    { label: '교수님 및 연구실', value: 'professors' },
    { label: '제휴 업체', value: 'partners' },
  ];

  const departments = [
    {
      id: 1,
      name: '컴퓨터 공학부',
      image: '/images/컴퓨터공학부.png',
      departmentName: 'COMPUTER_SCI',
    },
    {
      id: 2,
      name: '임베디드시스템공학과',
      image: '/images/임베디드시스템공학과.png',
      departmentName: 'EMBEDDED',
    },
    {
      id: 3,
      name: '정보통신학과',
      image: '/images/정보통신학과.png',
      departmentName: 'INFO_COMM',
    },
    {
      id: 4,
      name: '교학실',
      image: '/images/교학실.png',
      departmentName: 'IT_COLLEGE',
    },
  ];

  useEffect(() => {
    if (activeTab === 'professors') {
      const fetchProfessorPosts = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(
            'https://codin.inu.ac.kr/api/info/lab'
          );
          if (response.data.success) {
            setProfessorPosts(response.data.dataList);
          } else {
            setError(
              response.data.message || '데이터를 가져오는 데 실패했습니다.'
            );
          }
        } catch (err) {
          setError(err.message || '알 수 없는 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };

      fetchProfessorPosts();
    }
    if (activeTab === 'partners') {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            'https://codin.inu.ac.kr/api/info/partner'
          );

          console.log('Fetched partner data:', res.data.dataList);
          setPartners(res.data.dataList);
        } catch (err) {
          setError(err.message || '알 수 없는 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [activeTab]);

  return (
    <>
      <Header>
        <Header.BackButton onClick={navigateToMain} />
        <Header.Title>학과 소개</Header.Title>
      </Header>

      <DefaultBody hasHeader={1}>
        <div className="mt-[18px]" />
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="mt-[18px]" />

        {activeTab === 'phoneDirectory' && (
          <ul className="grid grid-cols-2 gap-[18px] w-full">
            {departments.map(department => (
              <li key={department.id}>
                <Link href={`./department-info/${department.departmentName}`}>
                  <div className="block border flex-1 rounded-[15px] cursor-pointer">
                    <div className="aspect-square flex flex-col items-center justify-center ">
                      <img
                        src={department.image.replace('/public', '')}
                        alt={department.name}
                        className="min-h-[98px] max-h-[98px]"
                      />
                      <p className="text-center text-Lm">{department.name}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'professors' && (
          <div>
            {loading ? (
              <p className="text-center text-gray-500">로딩 중...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <ul className="grid grid-cols-1 gap-4">
                {professorPosts.map(post => (
                  <li
                    key={post.id}
                    className="p-4 border rounded-lg shadow bg-white"
                  >
                    <h2 className="font-bold text-gray-800">{post.title}</h2>
                    <p className="text-gray-600 mt-1">{post.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      담당 교수: {post.professor}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {activeTab === 'partners' && (
          <ul className="grid grid-cols-2 place-items-center gap-[11px] w-full">
            {/* LinkCard 컴포넌트화 */}
            {partners.map((partner) => (
              <li key={partner.id} className='flex justify-center items-center'>
                <PartnerLinkCard partner={partner} />
              </li>
            ))}

          </ul>
        )}
      </DefaultBody>
      <BottomNav />
    </>
  );
}
