'use client';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker'; // 날짜 선택을 위한 라이브러리
import 'react-datepicker/dist/react-datepicker.css'; // 스타일시트 임포트
import { ko } from 'date-fns/locale'; // 한글 로케일 임포트
import React from 'react';
import { newDate } from 'react-datepicker/dist/date_utils';
import TimePicker from 'react-time-picker';
import { PostVote } from '../../../../api/vote/postVote';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import CommonBtn from '@/components/buttons/commonBtn';
import CheckIcon from '@/components/icons/CheckIcon';

export default function Vote() {
  const router = useRouter();
  const [checked, setChecked] = useState<boolean>(false);
  const [anonymity, setAnonymity] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>(['', '']);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // 날짜 상태
  const [selectedTime, setSelectedTime] = useState<string>('18:00');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleDateChange = (date: Date): void => {
    setSelectedDate(date);
  };

  const handletitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setContent(e.target.value);
  };

  const handleTimeChange = (time: string) => {
    if (time) {
      setSelectedTime(time); // 변환된 24시간 형식 시간 상태 업데이트
      console.log('시간변경', time);
    }
  };

  const handleChecked = (e: React.MouseEvent<HTMLInputElement>): void => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };

  const handleAnonymity = (e: React.MouseEvent<HTMLInputElement>): void => {
    if (anonymity) {
      setAnonymity(false);
    } else {
      setAnonymity(true);
    }
  };

  const addOption = (): void => {
    if (options.length < 5) {
      setOptions([...options, '']); // 새로운 빈 항목 추가
    } else {
      alert('옵션은 최대 3개까지만 추가할 수 있습니다.');
    }
  };

  const getCanSubmit = (): boolean => {
    // 제목, 내용, 항목이 모두 입력되었는지 확인
    return (
      title !== '' && content !== '' && options.every(option => option !== '')
    );
  };

  const handleOptionChange = (index: number, value: string): void => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions); // 해당 인덱스의 옵션값 업데이트
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    console.log('버튼 눌림');

    if (!getCanSubmit()) {
      alert('제목, 내용, 항목을 모두 입력해주세요.');
      return;
    }

    // selectedTime에서 시, 분을 추출 (예: "10:52" -> 10, 52)
    const [hours, minutes] = selectedTime.split(':');

    // selectedDate에서 년, 월, 일 정보 가져오기
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줘야 합니다.
    const day = selectedDate.getDate();

    // 두 값을 yyyy/MM/dd HH:mm 형식으로 결합
    const formattedDate = `${year}/${month.toString().padStart(2, '0')}/${day
      .toString()
      .padStart(2, '0')} ${hours}:${minutes}`;

    try {
      const response = await PostVote(
        title,
        content,
        options,
        checked,
        formattedDate,
        anonymity
      );
      console.log('결과:', response);
      router.push('/vote');
    } catch (error) {
      console.error('투표 작성 실패', error);
      const message = error.response.data.message;
      alert(message);
    }
  };
  const inputStyle =
    'shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] bg-white rounded-[15px] text-[#AEAEAE]';
  return (
    <div className="vote w-full">
      <Header
        showBack
        title={`투표 작성`}
      />
      <DefaultBody hasHeader={1}>
        <input
          className="defaultInput mt-[10px]"
          style={{ fontSize: '16px', fontWeight: 'bold', color: '#808080' }}
          id="write_title"
          placeholder="투표 제목"
          onChange={handletitleChange}
        ></input>
        <div id="voteCont_write">
          {options.map((option, index) => (
            <input
              key={index}
              className="defaultInput mt-[12px]"
              value={option}
              placeholder="항목 입력"
              onChange={e => handleOptionChange(index, e.target.value)}
            />
          ))}

          <button
            id="addOption"
            className={`text-Mm flex w-full align-center justify-center py-[11px] mt-[10px] ${inputStyle}`}
            onClick={addOption}
          >
            + 항목 추가
          </button>
        </div>

        <div
          className={`w-full flex justify-end items-center gap-[12px] my-[16px] `}
        >
          <div
            id="multipleCont"
            className="flex items-center gap-[5px]"
          >
            <input
              type="checkbox"
              className="hidden peer"
              id="multipleBtn"
              onClick={handleChecked}
            ></input>
            <label
              htmlFor="multipleBtn"
              className="w-[17px] h-[17px] rounded-full border border-[#CDCDCD] flex items-center justify-center cursor-pointer transition-all duration-300 peer-checked:border-[#0D99FF] relative"
            >
              <CheckIcon
                className={`w-[8px] h-[6px] ${
                  checked ? 'text-[#0D99FF]' : 'text-[#CDCDCD]'
                }`}
              />
            </label>
            <div
              id="multipleMent"
              className={`text-Mr ${
                checked ? 'text-[#0D99FF]' : 'text-[#CDCDCD]'
              }`}
            >
              복수선택
            </div>
          </div>

          <div
            id="anonymityCont"
            className="flex items-center gap-[5px]"
          >
            <input
              type="checkbox"
              className="hidden peer"
              id="anonymityBtn"
              onClick={handleAnonymity}
            ></input>
            <label
              htmlFor="anonymityBtn"
              className="w-[17px] h-[17px] rounded-full border border-[#CDCDCD] flex items-center justify-center cursor-pointer transition-all duration-300 peer-checked:border-[#0D99FF] relative"
            >
              <CheckIcon
                className={`w-[8px] h-[6px] ${
                  anonymity ? 'text-[#0D99FF]' : 'text-[#CDCDCD]'
                }`}
              />
            </label>
            <div
              id="anonymityMent"
              className={`text-Mr ${
                anonymity ? 'text-[#0D99FF]' : 'text-[#CDCDCD]'
              }`}
            >
              익명
            </div>
          </div>
        </div>
        <div id="endTimeCont">
          <div className="flex justify-between items-center">
            <h3 className="text-Lm mb-[13px] pt-[8px]">종료시간 설정</h3>
            <input
              type="time"
              value={selectedTime}
              onChange={e => handleTimeChange(e.target.value)}
            />

            {/* <TimePicker
              id="write_time"
              value={selectedTime}
              format="hh:mm a"
              onChange={handleTimeChange}
              clearIcon
              clockIcon
              locale="ko-KR"
              hourAriaLabel="false"
              className="transform translate-y-[20%] z-50"
            /> */}
          </div>
          <div
            id="dateCont"
            className={`${inputStyle} relative max-h-[47px] px-[22px] py-[13px] flex flex-start justify-start items-center`}
          >
            <img
              src="/icons/board/Clock.svg"
              className="w-[19px] h-[19px] mr-[12px]"
            />

            <div className="flex-1">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd (E)"
                id="write_date"
                locale={ko}
              />
            </div>
          </div>
        </div>

        <textarea
          className={`${inputStyle} text-Mm mt-[10px] min-h-[211px] resize-none py-[11px] px-[23px] rounded box-border mb-[85px] focus:outline-none`}
          id="write_content"
          placeholder="내용을 입력하세요"
          onChange={handleContentChange}
        />

        <CommonBtn
          status={getCanSubmit() ? 1 : 0}
          type="submit"
          text="작성 완료"
          onClick={handleSubmit}
        />
      </DefaultBody>
    </div>
  );
}
