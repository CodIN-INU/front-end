'use client';
import { FC, useEffect, useRef, useState } from 'react';
import { fetchClient } from '@/api/clients/fetchClient';
import { compressBase64Image } from '@/lib/utils/compressBase64Image';

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

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    const el = inputRef.current;
    if (!el) return;
    try {
      el.focus();
      const pos = Math.max(0, Math.min(4, password.length));
      el.setSelectionRange?.(pos, pos);
    } catch {}
  };

  useEffect(() => {
    focusInput();
    const onVisible = () => {
      if (!document.hidden) {
        setTimeout(focusInput, 0);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    const onWindowFocus = () => setTimeout(focusInput, 0);
    window.addEventListener('focus', onWindowFocus);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onWindowFocus);
    };
  }, []);

  useEffect(() => {
    focusInput();
  }, [password.length]);

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
        maxBytes: 180 * 1024,
        maxWidth: 900,
        minWidth: 240,
        startQuality: 0.72,
        minQuality: 0.4,
      });
      formData.append('signatureImage', compressed);

      const response = await fetchClient(`/ticketing/event/complete/${eventId}`, {
        method: 'POST',
        body: formData,
      });

      console.log('완료 요청 결과:', response);
      onSubmit();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('완료 요청 오류:', error);
      alert('비밀번호가 올바르지 않습니다.');

      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setPassword('');

      setTimeout(focusInput, 0);

      if (nextAttempts >= maxAttempts) {
        alert('최대 시도 횟수를 초과하였습니다.');
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[350] flex justify-center items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) focusInput();
      }}
    >
      <div className="bg-white w-[75%] max-w-[400px] rounded-xl shadow-lg p-6 relative text-center">
        <button className="absolute top-3 right-3 text-gray-400" onClick={onClose}>
          X
        </button>

        <p className="text-[13px] font-medium mb-[22px]">
          관리자 비밀번호를 입력해주세요 ({attempts}/{maxAttempts})
        </p>

        <div
          className="flex justify-center gap-[31px] mb-5 cursor-pointer select-none"
          onClick={focusInput}
          onMouseDown={(e) => e.preventDefault()}
        >
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
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="\d*"
          maxLength={4}
          value={password}
          onChange={handleChange}
          style={{ position: 'absolute', left: '-9999px' }}
          autoFocus
        />

        <button
          className={`w-full h-10 mt-2 font-bold text-[14px] rounded transition-all duration-200 ${
            password.length === 4 ? 'bg-[#0D99FF] text-white' : 'bg-[#E8EDF3] text-[#8B8B8B]'
          }`}
          onClick={handleConfirm}
          disabled={password.length < 4 || isSubmitting}
        >
          {isSubmitting ? '확인 중..' : '확인'}
        </button>
      </div>
    </div>
  );
};

export default AdminPasswordModal;
