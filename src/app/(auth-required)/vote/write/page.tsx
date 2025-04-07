
'use client';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';  // 날짜 선택을 위한 라이브러리
import "react-datepicker/dist/react-datepicker.css";  // 스타일시트 임포트
import { ko } from 'date-fns/locale';  // 한글 로케일 임포트
import React from 'react';
import { newDate } from 'react-datepicker/dist/date_utils';
import TimePicker from 'react-time-picker';
import { PostVote } from '../../../../api/vote/postVote';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import CommonBtn from '@/components/buttons/commonBtn';

export default function Vote() {
    const router = useRouter();
    const [checked, setChecked] = useState<boolean>(false);
    const [anonymity, setAnonymity] = useState<boolean>(false);
    const [options, setOptions] = useState<string[]>(['', '']);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());  // 날짜 상태
    const [selectedTime, setSelectedTime] = useState<string>('00:00');
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const handleDateChange = (date: Date): void => {
         setSelectedDate(date);
    }
   
    const convertTo24Hour = (time12h: string) => {
        const [time, modifier] = time12h.split(' ');
        if (!time || !modifier) return time12h; // 예외 처리
        let [hours, minutes] = time.split(':');

        // 오전/오후에 따른 시간 처리
        if (modifier === '오후' && +hours < 12) hours = `${+hours + 12}`;  // 오후 12시 이후에 12를 더해줌
        if (modifier === '오전' && +hours === 12) hours = '00';  // 오전 12시는 00으로 설정

        // 변환된 24시간 형식 시간 반환
        return `${hours}:${minutes}`;
    };



  const handletitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);

  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setContent(e.target.value);

  };



    const handleTimeChange = (time: string) => {
        if (time) {

            setSelectedTime(time);  // 변환된 24시간 형식 시간 상태 업데이트
            console.log('시간변경', time);
        }
    };

    const handleChecked = (e:React.MouseEvent<HTMLInputElement>):void =>{
        if (checked){setChecked(false);}
        else {setChecked(true);}
     }

     const handleAnonymity = (e:React.MouseEvent<HTMLInputElement>):void =>{
        if (anonymity){setAnonymity(false);}
        else {setAnonymity(true);}
     }

     const addOption = (): void => {
        if (options.length < 5) {
            setOptions([...options, '']);  // 새로운 빈 항목 추가
        } else {
            alert("옵션은 최대 3개까지만 추가할 수 있습니다.");
        }
    }

    const handleOptionChange = (index: number, value: string): void => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);  // 해당 인덱스의 옵션값 업데이트
    }


    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
            e.preventDefault();
            console.log('버튼 눌림');
            // selectedTime에서 시, 분을 추출 (예: "10:52" -> 10, 52)
            const [hours, minutes] = selectedTime.split(':');

            // selectedDate에서 년, 월, 일 정보 가져오기
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;  // getMonth()는 0부터 시작하므로 1을 더해줘야 합니다.
            const day = selectedDate.getDate();

            // 두 값을 yyyy/MM/dd HH:mm 형식으로 결합
            const formattedDate = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${hours}:${minutes}`;

             try {

                    const response = await PostVote( title, content, options, checked, formattedDate, anonymity);
                    console.log('결과:', response);
                    router.push('/vote');
                  } catch (error) {
                    console.error("투표 작성 실패", error);
                    const message = error.response.data.message;
                    alert(message);
                  }
                }



     return (
            <div className="vote w-full">
                <Header>
                    <Header.BackButton/>
                    <Header.Title>{`글쓰기`}</Header.Title>
                </Header>
                <DefaultBody hasHeader={1}>
                <input className="defaultInput mt-[18px]" id="write_title" placeholder='제목' onChange={handletitleChange}></input>
                    <div id='voteCont_write'>
                        <h3 className='text-XLm my-[24px]'>투표</h3>
                        
                        
                        {options.map((option, index) => (
                            <input
                                key={index}
                                className="defaultInput mt-[12px]"
                                value={option}
                                placeholder='항목 입력'
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                            />
                        ))}

                        <button id='addOption' className='text-Mm flex w-full align-center justify-center py-[14px] bg-sub rounded-[5px] mt-[12px] text-sub' onClick={addOption}>항목 추가</button>



                    </div>
                    <div id='endTimeCont'>
                        <div className='flex justify-between items-center'>
                            <h3 className='text-XLm my-[24px]'>종료시간 설정</h3>

                            <TimePicker
                                            id='write_time'
                                            value={selectedTime}
                                            format="hh:mm a"
                                            onChange={handleTimeChange}
                                            clearIcon
                                            clockIcon
                                            locale="ko-KR"
                                            hourAriaLabel='false'
                                            className="transform translate-y-[20%] z-50"
                            />
                        </div>
                        <div id='dateCont' className='relative max-h-[50px] border-[1px] rounded-[5px] p-[16px] flex flex-start justify-start items-center'>
                            <img src='/icons/board/Clock.svg' className='w-[16px] h-[16px] mr-[12px]'/>
                            
                            <div className='flex-1'>
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
                        className="text-Mm mt-[24px] min-h-[143px] resize-none p-[16px] border rounded box-border focus:border-black "
                        id="write_content"
                        placeholder="내용을 입력하세요"
                        onChange={handleContentChange}
                    />

                    <div className='w-full flex justify-end items-center gap-[12px] my-[16px]' >
                        <div id='multipleCont' className='flex items-center gap-[5px]'>
                            <input type="checkbox" className='hidden peer' id="multipleBtn" onClick={handleChecked}></input>
                            <label
                                htmlFor="multipleBtn"
                                className='w-[17px] h-[17px] rounded-full border border-gray-400 flex items-center justify-center cursor-pointer transition-all duration-300 peer-checked:bg-[#0D99FF] peer-checked:border-[#0D99FF] relative'
                                >
                                <img src="/icons/board/check.svg" className="w-[9px] text-white text-[10px] transition-opacity duration-300"/>
                            </label>
                            <div id='multipleMent' className='text-Mr'>복수선택</div>
                        </div>

                        <div id='anonymityCont' className='flex items-center gap-[5px]'>
                            <input type="checkbox" className='hidden peer' id="anonymityBtn" onClick={handleAnonymity}></input>
                            <label
                                htmlFor="anonymityBtn"
                                className='w-[17px] h-[17px] rounded-full border border-gray-400 flex items-center justify-center cursor-pointer transition-all duration-300 peer-checked:bg-[#0D99FF] peer-checked:border-[#0D99FF] relative'
                                >
                                <img src="/icons/board/check.svg" className="w-[9px] text-white text-[10px] transition-opacity duration-300"/>
                            </label>
                            <div id='anonymityMent'className='text-Mr' >익명</div>
                        </div>
                    </div>
                    <CommonBtn status={1} type="submit" text="작성 완료" onClick={handleSubmit}/>

                </DefaultBody>
            </div>
        );

}
