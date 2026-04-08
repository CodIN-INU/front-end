import { ComponentProps } from 'react';

type Props = ComponentProps<'input'>;

/**
 * input 컴포넌트
 */
const Input = ({ className = '', value, type, ...rest }: Props) => {
  return (
    <input
      className={`border rounded-md px-3 py-2 focus:outline-none focus:border-[#0D99FF] ${className}`}
      value={type === 'number' && value === 0 ? '' : value}
      type={type}
      {...rest}
    />
  );
};

export { Input };

