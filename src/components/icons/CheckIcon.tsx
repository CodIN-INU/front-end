import React from "react";

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean; // true면 파랑, false면 회색
}

const CheckIcon: React.FC<CheckIconProps> = ({ active = false, ...props }) => {
  return (
    <svg
      width="12"
      height="9"
      viewBox="0 0 12 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.4118 1L3.94118 7.47059L1 4.52941"
        stroke="currentColor"
        strokeWidth="1.50588"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckIcon;
