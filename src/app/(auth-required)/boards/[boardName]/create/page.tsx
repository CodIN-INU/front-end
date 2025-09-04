'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { boardData } from '@/data/boardData';
import apiClient from '@/api/clients/apiClient';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import SmRoundedBtn from '@/components/buttons/smRoundedBtn';

const CreatePostPage = () => {
  const params = useParams();
  const router = useRouter();
  const boardName = params.boardName as string;
  const board = boardData[boardName];

  const handleBack = () => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/\/create$/, '');
    router.push(newPath);
  };

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-gray-700">
          존재하지 않는 게시판입니다.
        </h2>
      </div>
    );
  }

  const { tabs } = board;
  const hasTabs = tabs.length > 0;
  const defaultTab = hasTabs ? tabs[0].postCategory : 'default';

  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postCategory:
      tabs.find(tab => tab.postCategory === defaultTab)?.postCategory || '',
    anonymous: false,
  });
  const [postImages, setPostImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const selectedCategory =
      tabs.find(tab => tab.postCategory === activeTab)?.postCategory || '';
    setFormData(prevData => ({
      ...prevData,
      postCategory: selectedCategory,
    }));
  }, [activeTab, tabs]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPostImages(files);
      setPreviewImages(files.map(file => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.postCategory) {
      alert('카테고리가 설정되지 않았습니다. 다시 시도해주세요.');
      return;
    }

    const data = new FormData();
    data.append('postContent', JSON.stringify(formData));
    postImages.forEach(file => data.append('postImages', file));

    setIsLoading(true);

    try {
      const response = await apiClient.post('/posts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const postId = response?.data?.data?.postId;
      if (postId) {
        const newPath = `/boards/${boardName}?postId=${postId}`;
        router.push(newPath);
      }

      previewImages.forEach(url => URL.revokeObjectURL(url));
      setPreviewImages([]);
      setPostImages([]);
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response?.data?.message ||
          `HTTP ${error.response?.status}: 응답 없음`;
        alert(`Error: ${errorMessage}`);
      } else {
        alert('예상치 못한 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 제목 또는 내용이 공백인지 확인
  const isFormValid =
    formData.title.trim() !== '' && formData.content.trim() !== '';

  return (
    <div className="w-full h-full">
      <Header
        showBack
        title="글 작성하기"
      />
      <DefaultBody hasHeader={1}>
        <div className="flex flex-col gap-[18px] pt-[18px]">
          {hasTabs && (
            <div
              className="flex gap-[8px] overflow-x-scroll"
              id="scrollbar-hidden"
            >
              {tabs.map(tab =>
                tab.value === 'all' ? null : (
                  <div key={tab.postCategory}>
                    <SmRoundedBtn
                      text={tab.label}
                      onClick={() => setActiveTab(tab.postCategory)}
                      status={activeTab === tab.postCategory ? 1 : 0}
                    />
                  </div>
                )
              )}
            </div>
          )}
          <input
            type="text"
            name="title"
            placeholder="제목을 입력하세요"
            value={formData.title}
            onChange={handleChange}
            className="defaultInput"
          />

          <div className="flex flex-col gap-[12px]">
            <h3 className="text-XLm">사진을 추가하세요</h3>
            <div className="flex items-center gap-2 overflow-x-auto">
              {previewImages.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`preview-${index}`}
                  className="w-[100px] h-[100px] object-cover rounded-[5px]"
                />
              ))}
              <label
                className={`min-w-[52px] h-[52px] ${
                  postImages.length <= 0 ? 'ml-0' : 'ml-5'
                } border border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer`}
              >
                <img
                  src="/icons/board/camera.png"
                  width={18}
                  height={15}
                  alt={'이미지 추가'}
                />
                <span className="text-sr text-[12px]">
                  {postImages.length}/10
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <textarea
            name="content"
            placeholder="부적절하거나 불쾌감을 줄 수 있는 컨텐츠를 게시할 경우 제재를 받을 수 있습니다"
            value={formData.content}
            onChange={handleChange}
            className="w-full h-[143px] border border-gray-300 rounded-[5px] p-[16px] text-sm"
          ></textarea>

          {/* 하단 작성 완료 및 익명 */}
          <div className="fixed bottom-0 left-0 right-0 w-full bg-white p-4 flex flex-col items-center">
            <div className="w-full max-w-[500px] mx-auto">
              {/* 익명 여부 */}
              <div className="flex items-center justify-end w-full mb-4">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={e =>
                    setFormData(prevData => ({
                      ...prevData,
                      anonymous: e.target.checked,
                    }))
                  }
                  id="anonymous"
                  className="hidden"
                />
                <label
                  htmlFor="anonymous"
                  className={`w-[17px] h-[17px] border-2 rounded-full flex items-center justify-center cursor-pointer transition ${
                    formData.anonymous
                      ? 'bg-[#0d99ff] border-[#0d99ff]'
                      : 'bg-white border-gray-400'
                  }`}
                >
                  {formData.anonymous && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </label>
                <span className="ml-[5px] text-Mr text-gray-600">익명</span>
              </div>

              {/* 작성 완료 버튼 */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!isFormValid || isLoading} // 비활성화 조건 추가
                className={`w-full py-[12px] text-sm font-bold rounded-[5px] ${
                  isFormValid
                    ? 'bg-[#0d99ff] text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed' // 비활성화 시 스타일
                }`}
              >
                {isLoading ? '업로드 중...' : '작성 완료'}
              </button>
            </div>
          </div>
        </div>
      </DefaultBody>
    </div>
  );
};

export default CreatePostPage;
