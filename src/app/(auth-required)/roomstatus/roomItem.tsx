"use client";

import React from "react";

interface RoomItemProps {
    RoomName: string;
    RoomStatusList: (0 | 1)[];
}

const RoomItem: React.FC<RoomItemProps> = ({ RoomName, RoomStatusList }) => {
    return (
        <div className="flex flex-col gap-[12px]">

            <h3 className="text-[#212121] text-[14px] font-medium">{RoomName}</h3>

            <div className="time-table">
                <div className="flex w-full gap-[4px]">
                    {[9, 10, 11, 12, 1, 2, 3, 4, 5].map((number) => (
                        <p key={number} className="flex-1 ml-[4px] text-[#808080] font-regular text-[12px]">
                            {number}
                        </p>
                    ))}
                </div>
                <div className="flex gap-[2px] ml-[3px] w-full flex-wrap">
                    {RoomStatusList.map((status, index) => (
                        <div
                            key={index}
                            className={`flex-1 h-[12px] ${status ? 'bg-[#0D99FF]' : 'bg-[#EBF0F7]'}`}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoomItem;
