import axios from 'axios';

type UseDepartmentRatingInfoContextType = {
  departmentId: string;
};

export const useDepartmentRatingInfoContext = async ({
  departmentId,
}: UseDepartmentRatingInfoContextType) => {
  axios.defaults.withCredentials = true;

  try {
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/lectures/${departmentId}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return result.data;
  } catch (error) {
    throw error;
  }
};
