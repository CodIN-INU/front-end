import axios, {AxiosResponse} from 'axios';

const BASE_URL = 'https://www.codin.co.kr/api';

export const PostChatImage = async (accessToken: string, chatImages: File): Promise<any> => {
    console.log("전송 데이터", chatImages);

    try{
        const formData = new FormData();

 
         formData.append('chatImages', chatImages);
        

        const response = await axios.post(
            `${BASE_URL}/chats/image`, 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: ` ${accessToken}`
                   
                }
            }
        );
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response;
          console.error('Error response:', status, data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
    
        throw error;
      }
}