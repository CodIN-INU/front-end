"use client";

import React from "react";
import '@/styles/globals.css';

interface CommonBtnProps {
    id?: string;
    type?: string;
    text: string;
    status: number; // 0:비활성화, 1:활성화
    onClick?: (...args: any[]) => any;
}

const CommonBtn: React.FC<CommonBtnProps> = ({ text, status, onClick }) => {
    
    const cn = status? "bg-[#0D99FF] text-white" : "bg-[#EBF0F7] text-[#808080]";

    return (
        <button onClick={onClick} className={ "w-full h-[50px] rounded-[5px] text-XLm "+ cn }>
            {text}
        </button>
    );
};

export default CommonBtn;
