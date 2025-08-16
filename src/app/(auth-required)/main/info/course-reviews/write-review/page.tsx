"use client";

import DefaultBody from "@/components/Layout/Body/defaultBody";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import Header from "@/components/Layout/header/Header";
import { RateBar } from "@/components/Review/RateBar";
import {
  SetStateAction,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { departMentType, selectType } from "./type";
import {
  DEPARTMENT,
  GRADE,
  SEMESTER,
  ALERTMESSAGE,
  TEMPLATETEXT,
} from "./constants";
import { CustomSelect } from "@/components/Review/CustomSelect";
import { useSearchedReviewContext } from "@/api/review/useSearchedReviewContext";
import { AlertModal } from "@/components/modals/AlertModal";
import { submitReview } from "@/api/review/submitReview";
import { useRouter } from "next/navigation";
import { calcEmotion } from "./util/calcEmotion";
import { ReviewContext } from "@/context/WriteReviewContext";
import Rating from "@/components/info/rating";

const WriteReview = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [rating, setRating] = useState(0);
  const [lecture, setLecture] = useState<selectType>({
    label: "학과",
    value: "",
  });
  const [grade, setGrade] = useState<selectType>({
    label: "학년",
    value: "",
  });
  const [semester, setSemester] = useState<selectType>({
    label: "수강 학기",
    value: "",
  });
  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState<selectType>({
    label: "학과, 학년, 학기를 선택해주세요",
    value: "",
  });
  const [reviewContents, setReviewContents] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data } = useContext(ReviewContext);

  const ratingRef = useRef<HTMLDivElement | null>(null);

  const getReviewList = async () => {
    try {
      const response = await useSearchedReviewContext({
        department: lecture.value,
        grade: grade.value,
        semester: semester.value,
      });
      const data = response.dataList.map((e: departMentType) => {
        return {
          label: `(${semester.value})(${e.professor}) ${e.lectureNm}`,
          value: e._id,
        };
      });
      setDepartmentList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSummitReview = async () => {
    if (department.value === "") return;
    else {
      const response = await submitReview({
        lectureId: department.value,
        content: reviewContents,
        starRating: rating,
        semester: semester.value,
      });
      const message = response.message;
      alert(message);
      router.back();
    }
  };

  useEffect(() => {
    // if (data.departments.value !== '' && data.grade) {
    //   setLecture(data.departments);
    //   setGrade(data.grade);
    // }
    if (data.departments.value !== "") {
      setLecture(data.departments);
    }
    if (data.grade.value !== "") {
      setGrade(data.grade);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    if (
      lecture.value !== "null" &&
      grade.value !== "null" &&
      semester.value !== "null"
    ) {
      getReviewList();
      setDepartment({ label: "학과, 학년, 학기를 선택해주세요", value: "" });
    }
  }, [lecture, grade, semester]);

  if (!isClient) return null; // 서버에서는 렌더링하지 않음
  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>후기 작성하기</Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        <div className="flex flex-col justify-between">
          <div>
            <div className="w-full flex pt-[18px]">
              {/* 학과 학년 수강학기 선택 */}
              <CustomSelect
                options={DEPARTMENT}
                onChange={(selected: SetStateAction<selectType>) =>
                  setLecture(selected)
                }
                value={lecture}
                isSearchable={false}
                minWidth={74}
                inverted
                rounded
              />
              <CustomSelect
                options={GRADE}
                onChange={(selected: SetStateAction<selectType>) =>
                  setGrade(selected)
                }
                value={grade}
                isSearchable={false}
                minWidth={74}
                inverted
                rounded
              />
              <CustomSelect
                options={SEMESTER}
                onChange={(selected: SetStateAction<selectType>) =>
                  setSemester(selected)
                }
                value={semester}
                isSearchable={false}
                minWidth={74}
                inverted
                rounded
              />
            </div>
            {/* 수강 강의 선택 */}
            <div className="mt-5">
              <CustomSelect
                options={departmentList}
                onChange={(selected: SetStateAction<selectType>) =>
                  setDepartment(selected)
                }
                value={department}
                isSearchable={false}
              />
            </div>

            <p className="text-XLm mt-[24px]">
              전반적인 수업 경험은 어땠나요?
            </p>

            <p className="text-sr mt-[3px] mb-[22px] text-[#808080]">
              별점을 눌러 평가해주세요.
            </p>

            {/* 수업 후기 점수 평가(기존)  
            <div className="w-full mt-[12px]">
              {/* 1-5점  해당 바를 눌러 점수를 정할 수 있도록 기능 구현 필요
              <div className="text-XLm flex items-center mb-[12px] gap-[16px]">
                <div className="flex">
                  <span className="text-[#0D99FF] text-right">{`${
                    rating % 1 ? rating : rating + ".0"
                  }`}</span>{" "}
                  <span className="text-[#E5E7EB]">/ 5.0 </span>
                </div>

                <span className="text-[#0D99FF] text-Mm">{calcEmotion(rating)}</span>
              </div>
              <RateBar
                score={rating}
                barWidth={0.625}
                clickable={true}
                clickFn={setRating}
                className="mt-1"
              />
            </div>
            */}
            {/* 수업 후기 점수 평가(리디자인) */}
            <div className="flex w-full justify-center items-center">
              <div 
                className="flex w-fit justify-center items-center"
                ref={ratingRef}
                onClick={(e) => {
                  if (!ratingRef.current) return;

                  const rect = ratingRef.current.getBoundingClientRect();
                  const clickX = e.clientX - rect.left; // 클릭한 X 좌표 (div 안에서)
                  const ratio = clickX / rect.width;    // 0 ~ 1 사이 비율
                  const newRating = Math.min(5, Math.max(0, ratio * 5));
                  
                  // 0.25 단위로 스냅
                  const snapped = Math.round(newRating / 0.25) * 0.25;

                  setRating(Math.min(5, Math.max(0, snapped)));
                }}>
                <Rating score={rating} />
              </div>
            </div>
            {/* 후기 입력 공간 */}
            <div className="mt-[43px]">
              {/* 후기 내용 */}
              <textarea
                className="border-[0px] focus:border-[#0D99FF] focus:outline-none  focus:ring-[#0D99FF] border-gray-200 text-Mr rounded-[15px] px-[23px] py-[22px] sm:mt-5 w-full h-[20vh] sm:h-[30vh] resize-none shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)]"
                placeholder="상세한 후기를 작성해주세요"
                onChange={(e) => setReviewContents(e.target.value)}
                value={reviewContents}
              ></textarea>
            </div>
            <div className="w-full flex shrink-0 justify-end mt-[29px]">
              <button
                className="flex items-center gap-[6px] bg-[#0D99FF] text-white text-sm rounded-full px-[16px] py-[6px] mt-[6px] hover:bg-[#51b4fa]"
                onClick={() => {
                  // setReviewContents('강의와 교재는? : \n과제는? : \n시험은? : \n조별 과제는? : \n\n\n나만의 꿀팁 : ');
                  setIsModalOpen(true);
                }}
              >
                <img src="/icons/useTemp.png" width="15" /> 템플릿 사용하기
              </button>
            </div>
          </div>
          <button
            className={department.value === "" ? `mt-[53px] h-[50px] bg-[#EBF0F7] text-[#808080] rounded-md text-XLm`
              :`mt-[53px] h-[50px] bg-[#0D99FF] text-white rounded-md text-XLm`}
            onClick={() => onSummitReview()}
          >
            후기 작성하기
          </button>
        </div>

        {isModalOpen && (
          <AlertModal
            text={ALERTMESSAGE}
            templateText={TEMPLATETEXT}
            modalStateSetter={setReviewContents}
            onClose={setIsModalOpen}
          />
        )}
      </DefaultBody>

      <BottomNav activeIndex={3} />
    </Suspense>
  );
};

export default WriteReview;
