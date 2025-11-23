'use client';

import {  useRouter } from 'next/navigation';
import { useState, Suspense, ChangeEvent, FormEvent } from 'react';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import InputBlock from './components/InputBlock';
import { CreateTicketEventRequest } from '@/interfaces/TicketEventRequest';
import { fetchClient } from '@/api/clients/fetchClient';

export default function CreateEvent() {
  const router = useRouter();
 
  const [form, setForm] = useState<CreateTicketEventRequest>({});

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
        ...prev,
        [name]: name === "quantity" ? Number(value) : value,
    }));
  };


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setImageFile(file); 
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    // 이미지 먼저 추가
    if (imageFile) formData.append("image", imageFile);

    // form의 모든 필드를 자동으로 추가
    Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
        formData.append(key, String(value));
        }
    });

    try{
        
        const res = fetchClient('/admin/event/create', {method: 'POST'});
        console.log('등록 결과:', res);
        alert("등록 성공!");
    }catch(e){
        alert("생성 실패");
    }

    

    
  };


  return (
    <Suspense>
      <Header showBack title='간식나눔 티켓팅 생성'/>

      <DefaultBody hasHeader={1}>
            <div className='w-full flex flex-col justify-start items-start font-notosans font-medium text-[16px] leading-[19px] text-black gap-y-[15px]'>
                {/* 간식 이미지 */}
                <div className='flex flex-col w-full'>
                    <div>간식 이미지</div>
                    <label className="w-[101px] h-[101px] border border-[#D4D4D4] rounded-xl flex flex-col items-center justify-center text-gray-400 text-xs cursor-pointer mt-3">
              {imagePreview ? (
                // 이미지 미리보기
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <>
                  {/* svg 이미지 */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_6820_9155" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                        <rect width="32" height="32" fill="#D4D4D4"/>
                    </mask>
                    <g mask="url(#mask0_6820_9155)">
                        <path d="M6.03581 30.1844C5.30247 30.1844 4.6747 29.8911 4.15247 29.3045C3.63025 28.718 3.36914 28.0128 3.36914 27.1891V6.22231C3.36914 5.39861 3.63025 4.69348 4.15247 4.10691C4.6747 3.52034 5.30247 3.22705 6.03581 3.22705H16.7025V6.22231H6.03581V27.1891H24.7025V15.2081H27.3691V27.1891C27.3691 28.0128 27.108 28.718 26.5858 29.3045C26.0636 29.8911 25.4358 30.1844 24.7025 30.1844H6.03581ZM7.36914 24.1939H23.3691L18.3691 16.7057L14.3691 22.6962L11.3691 18.2034L7.36914 24.1939ZM22.0358 12.2128V9.21757H19.3691V6.22231H22.0358V3.22705H24.7025V6.22231H27.3691V9.21757H24.7025V12.2128H22.0358Z" fill="#D4D4D4"/>
                    </g>
                </svg>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            </div>
                 {/* 행사명 */}
                <InputBlock
                    label="행사명"
                    name="eventTitle"
                    placeholder="내용을 입력하세요."
                    value={form.eventTitle}
                    onChange={handleChange}
                />

                {/* 일시 */}
                <InputBlock
                    label="일시"
                    name="eventTime"
                    type="datetime-local"
                    value={form.eventTime}
                    onChange={handleChange}
                    withIcon
                />

                {/* 장소 */}
                <InputBlock
                    label="장소"
                    name="locationInfo"
                    placeholder="내용을 입력하세요."
                    value={form.locationInfo}
                    onChange={handleChange}
                />

                {/* 대상 */}
                <InputBlock
                    label="대상"
                    name="target"
                    placeholder="내용을 입력하세요."
                    value={form.target}
                    onChange={handleChange}
                />

                {/* 간식 수량 */}
                <InputBlock
                    label="간식 수량"
                    name="quantity"
                    placeholder="내용을 입력하세요."
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                />

                {/* 티켓팅 시작시간 */}
                <InputBlock
                    label="티켓팅 시작시간"
                    name="eventEndTime"
                    type="datetime-local"
                    value={form.eventEndTime}
                    onChange={handleChange}
                    withIcon
                />

                {/* 홍보글 링크 */}
                <InputBlock
                    label="간식나눔 행사 홍보글 링크"
                    name="promotionLink"
                    placeholder="내용을 입력하세요."
                    value={form.promotionLink}
                    onChange={handleChange}
                />

                {/* 문의 연락처 */}
                <InputBlock
                    label="문의 연락처"
                    name="inquiryNumber"
                    placeholder="내용을 입력하세요."
                    value={form.inquiryNumber}
                    onChange={handleChange}
                />

                {/* 행사 설명 */}
                <InputBlock
                    label="행사 설명"
                    name="description"
                    placeholder="내용을 입력하세요."
                    value={form.description}
                    onChange={handleChange}
                />

            </div>
      </DefaultBody>
    </Suspense>
  );
}
