// [ 년도.월.일 (요일) 시:분 ] 으로 바꿔주는 함수입니다
export function formatDateTimeWithDay(isoDateTime: string): string {
  const date = new Date(isoDateTime);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = dayNames[date.getDay()];

  return `${year}.${month}.${day} (${dayOfWeek}) ${hours}:${minutes}`;
}


// "2025.11.25 (화) 16:44" → "2025-11-25T16:44:00 형식으로 바꿔주는 함수입니다"
export const parseBackendDateToLocalDateTime = (str: string) => {
  if (!str) return "";

  //요일 제거
  let cleaned = str.replace(/\(.*?\)/g, "").trim(); 

  //날짜·시간 분리
  let [datePart, timePart] = cleaned.split(" ");

  // 공백이 없어서 하나만 나오는 경우 → 시간 붙어있을 수 있음
  if (!timePart) {
    // 정규식으로 시간 추출: HH:mm or HH:mm:ss
    const timeMatch = cleaned.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
    if (timeMatch) {
      timePart = timeMatch[1];
      datePart = cleaned.replace(timeMatch[1], "").trim();
    }
  }

  //날짜 포맷 변환
  if (datePart) {
    datePart = datePart.replace(/\./g, "-");
  }

  //시간이 없으면 "00:00:00" 기본값 적용
  if (!timePart || timePart.trim() === "") {
    return `${datePart}T00:00:00`;
  }

  //HH:mm → HH:mm:00
  if (/^\d{1,2}:\d{2}$/.test(timePart)) {
    timePart = `${timePart}:00`;
  }

  return `${datePart}T${timePart}`;
};

// "2025.11.25 (화) 16:44" → 11/25 형식으로 바꿔주는 함수입니다.
export function formatToMonthDay(raw: string): string {
  // 1) 숫자만 추출: 2025.12.02 -> 2025 12 02
  const match = raw.match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
  

  if (!match) return "";

  const [, year, month, day] = match;
  console.log(month,'/',day);
  return `${month}/${day}`;
}

