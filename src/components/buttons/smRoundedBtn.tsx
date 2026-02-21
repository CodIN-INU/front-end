"use client";

import React from "react";

interface SmRoundedBtnProps {
    text: string;
    status: number; // 0:비활성화, 1:활성화
    onClick?: () => void;
}

const SmRoundedBtn: React.FC<SmRoundedBtnProps> = ({ text, status, onClick }) => {
    
    const cn = status? "bg-[#0D99FF] text-white" : "bg-[#EBF0F7] text-[#808080]";

    return (
        <button type="button" onClick={onClick} className={ "whitespace-nowrap w-max py-[8px] px-[22px] rounded-[20px] font-medium text-[14px] "+ cn }>
            {text}
        </button>
    );
};

export default SmRoundedBtn;
