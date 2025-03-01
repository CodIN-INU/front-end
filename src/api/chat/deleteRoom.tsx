import axios, { AxiosResponse } from "axios";
import { PostReissue } from "../user/postReissue";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const deleteRoom = async (
  chatRoomId: string | string[]
): Promise<any> => {
  console.log("전송 데이터", chatRoomId);
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<any> = await axios.delete(
      `${apiUrl}/chatroom/${chatRoomId}`
    );

    console.log(response.data);
    console.log(response.headers);
    return response;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
       if (status === 401){
                  console.error('401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다.');
                  PostReissue();
                  deleteRoom(chatRoomId);
      
                }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};
