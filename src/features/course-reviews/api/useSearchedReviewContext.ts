import axios from 'axios';

type UseSearchedReviewContextType = {
  department?: string;
  grade?: string;
  semester?: string;
};

export const useSearchedReviewContext = async ({
  department = '',
  grade,
  semester = '',
}: UseSearchedReviewContextType) => {
  axios.defaults.withCredentials = true;

  try {
    const params = new URLSearchParams({
      department,
      grade: `${grade ?? ''}`,
      semester,
    });

    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/lectures/search-review?${params}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return result.data;
  } catch (error) {
    throw error;
  }
};
