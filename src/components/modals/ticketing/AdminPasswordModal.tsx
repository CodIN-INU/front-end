'use client';
import { FC, useState } from 'react';
import { fetchClient } from '@/api/clients/fetchClient';
import { compressBase64Image } from '@/utils/compressBase64Image';
interface AdminPasswordModalProps {
  onClose: () => void;
  onSubmit: () => void;
  eventId: string;
  signatureImage: string;
}

const AdminPasswordModal: FC<AdminPasswordModalProps> = ({
  onClose,
  onSubmit,
  eventId,
  signatureImage,
}) => {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxAttempts = 3;
  const dotColors = ['#409AF6', '#4EB1F8', '#5BC7FA', '#88D9FF'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (/^\d{0,4}$/.test(input)) {
      setPassword(input);
    }
  };

  const handleConfirm = async () => {
  if (password.length < 4) return;
  setIsSubmitting(true);

  try {
    const formData = new FormData(); 
    formData.append('password', password);
     const compressed = await compressBase64Image(signatureImage, {
      maxBytes: 180 * 1024,   // 필요 시 조정: 200*1024, 300*1024 등
      maxWidth: 900,          // 서명이라면 600~1000 사이 권장
      minWidth: 240,          // 더 줄일 최소 너비
      startQuality: 0.72,
      minQuality: 0.4
    });
    formData.append('signatureImage', compressed);

    const response = await fetchClient(`/ticketing/event/complete/${eventId}`, {
      method: 'POST',
      body: formData,
    });

    console.log('✅ 전송 성공:', response);
    onSubmit();
    onClose();
    window.location.reload();
  } catch (error) {
    console.error('❌ 전송 실패:', error);
    alert('비밀번호가 틀렸거나 오류가 발생했습니다.');
    setAttempts((prev) => prev + 1);
    setPassword('');
    if (attempts + 1 >= maxAttempts) {
      alert('최대 시도 횟수를 초과했습니다.');
      onClose();
    }
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[350] flex justify-center items-center">
      <div className="bg-white w-[75%] max-w-[400px] rounded-xl shadow-lg p-6 relative text-center">
        {/* 닫기 버튼 */}
        <button className="absolute top-3 right-3 text-gray-400" onClick={onClose}>
          ✕
        </button>

        <p className="text-[13px] font-medium mb-[22px]">
          관리자 비밀번호를 입력하세요. ({attempts}/{maxAttempts})
        </p>

        {/* 점 표시 */}
        <div className="flex justify-center gap-[31px] mb-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-[14px] h-[14px] rounded-full"
              style={{
                backgroundColor: i < password.length ? dotColors[i] : '#AEAEAE',
              }}
            />
          ))}
        </div>

        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={password}
          onChange={handleChange}
          style={{ position: 'absolute', left: '-9999px' }}
          autoFocus
        />

        {/* 확인 버튼 */}
        <button
          className={`w-full h-10 mt-2 font-bold text-[14px] rounded transition-all duration-200 ${
            password.length === 4 ? 'bg-[#0D99FF] text-white' : 'bg-[#E8EDF3] text-[#8B8B8B]'
          }`}
          onClick={handleConfirm}
          disabled={password.length < 4 || isSubmitting}
        >
          {isSubmitting ? '확인 중...' : '확인'}
        </button>
      </div>
    </div>
  );
};

export default AdminPasswordModal;
