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
    templateTextValue: string,
    modalStateSetterValue: Dispatch<SetStateAction<string>>,
    onCloseValue: Dispatch<SetStateAction<boolean>>
  ) => {
    modalStateSetterValue(templateTextValue);
    onCloseValue(false);
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-gray-500/50 flex justify-center items-center z-30"
      onClick={() => onClose(false)}
    >
      <div
        className="w-[20rem] h-[15rem] bg-white rounded-2xl px-7"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full mt-10 text-lg whitespace-pre-wrap">{text}</div>
        <div className="mt-9 flex flex-col">
          <button
            className="bg-[#0D99FF] rounded-lg h-10 text-white hover:bg-[#51b4fa]"
            onClick={() =>
              onConfirm(templateText, modalStateSetter, onClose)
            }
          >
            확인
          </button>
          <button
            className="rounded-lg h-10"
            onClick={() => onClose(false)}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export { AlertModal };
