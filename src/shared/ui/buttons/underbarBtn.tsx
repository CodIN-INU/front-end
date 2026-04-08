import { ComponentProps } from 'react';

type UnderbarBtnType = {
  text: string;
  inverted?: boolean;
} & ComponentProps<'button'>;

const UnderbarBtn = ({
  text,
  inverted = false,
  className = '',
  ...rest
}: UnderbarBtnType) => {
  if (inverted) {
    return (
      <button
        className={`text-[#0D99FF] px-2 py-2 text-sm underline underline-offset-4 ${className}`}
        {...rest}
      >
        {text}
      </button>
    );
  }

  return (
    <button
      className={`text-[#808080] px-2 py-2 text-sm underline-offset-4 ${className}`}
      {...rest}
    >
      {text}
    </button>
  );
};

export { UnderbarBtn };

