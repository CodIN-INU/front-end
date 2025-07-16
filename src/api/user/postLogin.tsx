import axios, { AxiosResponse } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostLogin = async (
    studentId: string,
    password: string
): Promise<any> => {
  console.log("전송 데이터", studentId, password);
  axios.defaults.withCredentials = true;

  try {
    const response: AxiosResponse<any> = await axios.post(
        `${apiUrl}/auth/login`,
        {
          email: studentId,
          password: password,
        },
        { withCredentials: true }
    );

    if( process.env.NEXT_PUBLIC_ENV === 'dev'){
      alert("개발 서버에서 로그인 성공");
      // ✅ 서버에서 받은 JWT 토큰을 헤더에서 추출
      const token = response.headers["authorization"];
      const refreshToken = response.headers["x-refresh-token"];
      alert(token);

      if (token) {
        // ✅ JWT를 localStorage에 저장 (WebView-safe)
        localStorage.setItem("accessToken", token);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
      }
    }

    console.log(response.data);
    console.log(response.headers);

    // 로그인 성공 시 React Native로 메시지 전송
    onLoginSuccess(); // 로그인 성공 시 네이티브로 메시지 전달

    return response;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};

// 로그인 성공 시 네이티브로 메시지 보내는 함수
const onLoginSuccess = () => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "LOGIN_SUCCESS" })
    );
  }
};
