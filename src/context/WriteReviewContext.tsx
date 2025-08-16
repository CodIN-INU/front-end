"use client";

import { selectType } from '@/app/(auth-required)/info/course-reviews/write-review/type';
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type DataType = {
  departments: selectType;
  grade: selectType;
};

type ContextType = {
  data: DataType;
  setData: Dispatch<SetStateAction<DataType>>;
};

// Context 기본값을 명확하게 설정
export const ReviewContext = createContext<ContextType | null>(null);

type Props = { children: ReactNode };

export default function ReviewProvider({ children }: Props) {
  const [data, setData] = useState<DataType>({
    departments: { label: "컴공", value: "COMPUTER_SCI" },
    grade: { label: "", value: "" },
  });

  return (
    <ReviewContext.Provider value={{ data, setData }}>
      {children}
    </ReviewContext.Provider>
  );
}
