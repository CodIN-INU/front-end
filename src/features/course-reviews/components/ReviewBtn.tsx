import Link from "next/link";
import { SlPencil } from "react-icons/sl";

const ReviewBtn = () => {
  return (
    <div className="h-[54px] w-[54px] bg-sky-500 rounded-full flex justify-center items-center fixed bottom-[100px] right-[max(16px,calc(50%-250px+16px))]">
      <Link href={"/main/info/course-reviews/write-review"}>
        <SlPencil className="text-white w-[25px] h-[25px]" />
      </Link>
    </div>
  );
};

export { ReviewBtn };
