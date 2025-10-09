// data/boardData.ts

export interface Tab {
    label: string;
    value: string;
    postCategory: string; // 백엔드와의 맵핑용 카테고리
}

export interface Board {
    name: string;
    icon?: string;
    tabs: Tab[];
    type: 'list' | 'gallery' | 'poll'; // 게시판 유형: 'list' 또는 'gallery'
    backLink?: string; // 뒤로가기 URL (옵션)
}

export const boardData: Record<string, Board> = {
    'need-help': {
        name: '구해요',
        backLink: '/main', // 뒤로가기 시 이동할 URL
        tabs: [
            { label: '전체', value: 'all', postCategory: 'REQUEST' },
            { label: '스터디', value: 'study', postCategory: 'REQUEST_STUDY' },
            { label: '프로젝트', value: 'project', postCategory: 'REQUEST_PROJECT' },
            { label: '공모전/대회', value: 'competition', postCategory: 'REQUEST_COMPETITION' },
            { label: '소모임', value: 'gathering', postCategory: 'REQUEST_GROUP' },
        ],
        type: 'list',
    },
    'communicate': {
        name: '소통해요',
        backLink: '/main',
        tabs: [
            { label: '전체', value: 'all', postCategory: 'COMMUNICATION' },
            { label: '질문', value: 'question', postCategory: 'COMMUNICATION_QUESTION' },
            { label: '취업수기', value: 'job-experience', postCategory: 'COMMUNICATION_JOB' },
            { label: '꿀팁공유', value: 'tips', postCategory: 'COMMUNICATION_TIP' },
        ],
        type: 'list',
    },
    'extracurricular': {
        name: '비교과',
        backLink: '/main',
        tabs: [
            { label: '전체', value: 'all', postCategory: 'EXTRACURRICULAR' },
            { label: '정보대', value: 'question', postCategory: 'EXTRACURRICULAR_INNER' },
            { label: 'StarINU', value: 'job-experience', postCategory: 'EXTRACURRICULAR_STARINU' },
            { label: '교외', value: 'tips', postCategory: 'EXTRACURRICULAR_OUTER' },
        ],
        type: 'gallery',
    },
    'best': {
        name: '베스트 게시물',
        backLink: '/main',
        tabs: [],
        type: 'list',
    },
    'used-books': {
        name: '중고 거래',
        backLink: '/main',
        tabs: [
            { label: '팝니다', value: 'selling', postCategory: 'BOOKS_SELL' },
            { label: '삽니다', value: 'buying', postCategory: 'BOOKS_BUY' },
        ],
        type: 'gallery',
    },
    'ticketing': {
        name: '간식나눔',
        backLink: '/ticketing',
        tabs: [
            { label: '송도캠', value: 'songdo', postCategory: 'SONGDO_CAMPUS' },
            { label: '미추홀캠', value: 'Michuhol', postCategory: 'MICHUHOL_CAMPUS' },
        ],
        type: 'gallery',
    },

     'ticketingAdmin': {
        name: '간식나눔 행사 관리',
        backLink: '/ticketing/admin',
        tabs: [
            { label: '전체', value: 'all', postCategory: 'all' },
            { label: '진행 중', value: 'open', postCategory: 'open' },
            { label: '진행 완료', value: 'ended', postCategory: 'ended' },
        ],
        type: 'gallery',
    },

    'myTicketing': {
        name: '티켓팅 내역',
        tabs: [
            { label: '간식 미수령', value: 'wating', postCategory: 'WAITING' },
            { label: '사용 완료', value: 'completed', postCategory: 'COMPLETED' },          
            { label: '티켓팅 취소', value: 'canceled', postCategory: 'CANCELED' },
        ],
        type: 'gallery',
    },

};
