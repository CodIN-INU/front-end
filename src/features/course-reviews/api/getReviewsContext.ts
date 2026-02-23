import axios from 'axios';

type UseReviewContextType = {
  department: string;
  option: string;
  page: number;
  keyword?: string;
};

export const useReviewsContext = async ({
  department,
  option,
  page,
  keyword = '',
}: UseReviewContextType) => {
  axios.defaults.withCredentials = true;

  try {
    const parameters = new URLSearchParams({
      department,
      keyword,
      option,
      page: `${page}`,
    });

    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/lectures/list?${parameters}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return result.data;
  } catch (error) {
    throw error;
  }
};
