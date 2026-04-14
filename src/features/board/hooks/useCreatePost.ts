'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Tab } from '@/features/board/data/boardData';
import { createPost } from '../api/createPost';
import { useRNImagePicker } from '@/shared/hooks';

export interface CreatePostFormData {
  title: string;
  content: string;
  postCategory: string;
  anonymous: boolean;
}

const initialFormData: CreatePostFormData = {
  title: '',
  content: '',
  postCategory: '',
  anonymous: false,
};

export function useCreatePost(
  boardName: string,
  tabs: Tab[],
  defaultPostCategory: string
) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(defaultPostCategory);
  const [formData, setFormData] = useState<CreatePostFormData>({
    ...initialFormData,
    postCategory: defaultPostCategory,
  });
  const [postImages, setPostImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isRN, openPicker } = useRNImagePicker();

  useEffect(() => {
    const category =
      tabs.find((tab) => tab.postCategory === activeTab)?.postCategory ?? '';
    setFormData((prev) => ({ ...prev, postCategory: category }));
  }, [activeTab, tabs]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileList = Array.from(files);
    setPostImages(fileList);
    setPreviewImages(fileList.map((f) => URL.createObjectURL(f)));
  }, []);

  // 앱 환경: RN ImagePicker로 다중 이미지 선택
  const handleNativePick = useCallback(async () => {
    const files = await openPicker({ multiple: true });
    if (files.length === 0) return;
    setPostImages(files);
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  }, [openPicker]);

  const handleAnonymousChange = useCallback((checked: boolean) => {
    setFormData((prev) => ({ ...prev, anonymous: checked }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.postCategory) {
        alert('카테고리가 설정되지 않았습니다. 다시 시도해주세요.');
        return;
      }

      setIsLoading(true);
      try {
        const { postId } = await createPost(formData, postImages);
        previewImages.forEach((url) => URL.revokeObjectURL(url));
        setPreviewImages([]);
        setPostImages([]);
        router.push(`/boards/${boardName}?postId=${postId}`);
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string }; status?: number } };
        const message =
          err.response?.data?.message ||
          (err.response?.status ? `HTTP ${err.response.status}: 응답 없음` : null) ||
          '예상치 못한 오류가 발생했습니다.';
        alert(message);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, postImages, previewImages, boardName, router]
  );

  const isFormValid =
    formData.title.trim() !== '' && formData.content.trim() !== '';

  return {
    activeTab,
    setActiveTab,
    formData,
    postImages,
    previewImages,
    isLoading,
    isFormValid,
    isRN,
    handleChange,
    handleFileChange,
    handleNativePick,
    handleAnonymousChange,
    handleSubmit,
  };
}
