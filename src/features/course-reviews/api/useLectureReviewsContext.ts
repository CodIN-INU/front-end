import axios from 'axios';

type UseLectureReviewsContextType = {
  lectureId: string;
};

export const useLectureReviewsContext = async ({
  lectureId,
}: UseLectureReviewsContextType) => {
  axios.defaults.withCredentials = true;

  try {
    const params = new URLSearchParams({ page: '0' });
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/reviews/${lectureId}?${params}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return result.data;
  } catch (error) {
    throw error;
  }
};
