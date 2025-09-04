import axios from 'axios';

type submitReviewType = {
  lectureId: string;
  content: string;
  starRating: number;
  semester: string;
};

const submitReview = async ({
  lectureId,
  content,
  starRating,
  semester,
}: submitReviewType) => {
  axios.defaults.withCredentials = true;

  try {
    const parameter = new URLSearchParams({
      content: content,
      starRating: `${starRating}`,
      semester: semester,
    });

    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/lecture/${lectureId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        content: content,
        starRating: starRating,
        semester: semester,
      }
    );

    return result.data;
  } catch (err) {
    console.error(err);
    if (err.code === 404) {
      alert('이미 작성된 후기가 있습니다.');
    } else if (err.code === 401) {
      alert('로그인이 필요합니다.');
    }
    return false;
  }
};

export { submitReview };
