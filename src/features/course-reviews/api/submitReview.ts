import axios from 'axios';

type SubmitReviewType = {
  lectureId: string;
  content: string;
  starRating: number;
  semester: string;
};

export const submitReview = async ({
  lectureId,
  content,
  starRating,
  semester,
}: SubmitReviewType) => {
  axios.defaults.withCredentials = true;

  try {
    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/lecture/${lectureId}`,
      { content, starRating, semester },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return result.data;
  } catch (err: unknown) {
    const error = err as { response?: { status: number }; code?: number };
    const status = error.response?.status ?? error.code;
    if (status === 404) {
      alert('이미 작성된 후기가 있습니다.');
    } else if (status === 401) {
      alert('로그인이 필요합니다.');
    }
    return false;
  }
};
