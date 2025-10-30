import axios, { AxiosResponse } from 'axios';
import { PostReissue } from '../user/postReissue';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const GetVoteData = async (
  page: number,
  retryCount = 0
): Promise<any> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${apiUrl}/posts/category?postCategory=POLL&page=${page}`
    );
    console.log(response);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error('Error response:', status, data);
      if (status === 401) {
        console.error(
          '401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다.'
        );

        if (retryCount < 2) {
          console.log(`🔄 재시도 중... (${retryCount + 1}/2)`);

          try {
            const res = await PostReissue(); // 토큰 재발급 요청
            console.log(res);

            // PostReissue가 성공한 후에 GetChatRoomData 실행
            return await GetVoteData(page, retryCount + 1); // 재요청
          } catch (error) {
            console.error('❌ 토큰 재발급 실패', error);
            // 토큰 재발급 실패시 더 이상 재시도하지 않고 로그인 페이지로 이동
            // window.location.href =
            //   '/login?next=' + encodeURIComponent(window.location.pathname);
          }
        }

        console.error('❌ 2번 재시도 후에도 실패. 로그인 페이지로 이동합니다.');
        // window.location.href =
        //   '/login?next=' + encodeURIComponent(window.location.pathname);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }

    throw error;
  }
};
