import { Dispatch, SetStateAction } from 'react';

type AlertModalType = {
  text: string;
  templateText: string;
  modalStateSetter: Dispatch<SetStateAction<string>>;
  onClose: Dispatch<SetStateAction<boolean>>;
};

const AlertModal = ({
                      text,
                      templateText,
                      modalStateSetter,
                      onClose,
                    }: AlertModalType) => {
  const onConfirm = (
      templateText: string,
      modalStateSetter: Dispatch<SetStateAction<string>>,
      onClose: Dispatch<SetStateAction<boolean>>
  ) => {
    modalStateSetter(templateText);
    onClose(false);
  };

  return (
      <div
          className="fixed inset-0 w-screen h-screen bg-gray-500/50 flex justify-center items-center z-30"
          onClick={() => onClose(false)}
      >
        <div
            className="bg-white rounded-2xl px-[24px] pb-[24px]"
            onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full mt-[18px] text-Mm text-center whitespace-pre-wrap">{text}</div>
          <div className="mt-[13px] flex flex-col gap-[9px] w-[253px]">
            <button
                className="bg-[#0D99FF] rounded-lg h-10 text-white hover:bg-[#51b4fa]"
                onClick={() => onConfirm(templateText, modalStateSetter, onClose)}
            >
              확인
            </button>
            <button className="rounded-lg h-10 bg-[#EBF0F7]" onClick={() => onClose(false)}>
              취소
            </button>
          </div>
        </div>
      </div>
  );
};

export { AlertModal };
