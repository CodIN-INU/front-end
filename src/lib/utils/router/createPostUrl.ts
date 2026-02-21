/**
 * 게시판 종류와 게시글 ID를 사용하여 URL을 생성합니다.
 * @param boardType - 게시판 종류 (예: 'need-help', 'free-talk')
 * @param postId - 게시글 ID (예: '686e5839be10476b8edc4355')
 * @returns 생성된 URL 문자열 (예: 'main/boards/need-help?postId=686e5839be10476b8edc4355')
 */
/**
 * 게시판 제목(name)을 이용해 URL 경로에 사용되는 boardType을 찾습니다.
 * @param title - 게시판 제목 (예: '모집해요')
 * @returns 해당하는 boardType (예: 'need-help') 또는 찾을 수 없는 경우 undefined
 */
import { boardData } from "@/data/boardData";
export interface Tab {
    label: string;
    value: string;
    postCategory: string; // 백엔드와의 맵핑용 카테고리
}

export interface Board {
    name: string;
    icon?: string;
    tabs: Tab[];
    type: 'list' | 'gallery'; // 게시판 유형: 'list' 또는 'gallery'
    backLink?: string; // 뒤로가기 URL (옵션)
}
function getBoardTypeByTitle(title: string): string | undefined {
    const foundEntry = Object.entries(boardData).find(
        ([key, board]) => board.name === title
    );
    return foundEntry ? foundEntry[0] : undefined;
}


/**
 * 게시판 제목과 게시글 ID를 사용하여 URL을 생성합니다.
 * @param title - 게시판 제목 (예: '모집해요')
 * @param postId - 게시글 ID (예: '686e5839be10476b8edc4355')
 * @returns 생성된 URL 문자열 (예: 'main/boards/need-help?postId=...')
 */
// 'boardData'는 이전에 정의된 객체를 사용합니다.

export function createPostUrl(title: string, postId: string): string {
    // 1. '익명 채팅방'인 경우 채팅방 URL을 반환합니다.
    if (title === '익명 채팅방') {
        // http://localhost:3000은 개발 환경에서만 유효하며,
        // 실제 운영 환경에서는 클라이언트 URL을 동적으로 가져와 사용하는 것이 좋습니다.
        return `chatRoom/${postId}`;
    }

    // 2. '익명 채팅방'이 아닌 경우, 기존 로직을 실행합니다.
    const boardType = getBoardTypeByTitle(title);

    if (!boardType) {
        // 일치하는 게시판 제목이 없을 경우 에러를 발생시킵니다.
        throw new Error(`'${title}'에 해당하는 게시판 URL 타입을 찾을 수 없습니다.`);
    }

    return `main/boards/${boardType}?postId=${postId}`;
}

// getBoardTypeByTitle 함수와 boardData는 이전에 제공된 코드를 그대로 사용
// ...
