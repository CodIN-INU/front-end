import axios, {AxiosResponse} from 'axios';

const BASE_URL = 'https://www.codin.co.kr/api';

export const PutPassword = async (email:string, password:string): Promise<any> => {
    console.log("전송 데이터", email, password);

    try{
        const response: AxiosResponse<any> = await axios.post(
            `${BASE_URL}/email/auth/password/check`, 
            {
                email: email,
                password: password
            }
        );
        console.log(response.data);
        return response.data;
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