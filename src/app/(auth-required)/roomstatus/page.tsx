"use client";

import { FC, useState, useEffect, useRef } from "react";
import axios from "axios";
import BottomNav from "@/components/Layout/BottomNav";
import { Suspense } from 'react'
import Header from "@/components/Layout/header/Header";
import SmRoundedBtn from "@/components/buttons/smRoundedBtn";
import RoomItem from "./roomItem";

const RoomStatus: FC = () => {

    useEffect(() => {
        


    });

    return (
        <Suspense>
        <div className={"w-full h-full"}>

            <Header>
                <Header.BackButton />
                <Header.Title>강의실 현황</Header.Title>
            </Header>

            <main className="mt-[108px] px-0">
                <div className="flex w-full justify-center gap-[7px]">
                    <SmRoundedBtn text="1층" status={1} />
                    <SmRoundedBtn text="2층" status={0} />
                    <SmRoundedBtn text="3층" status={0} />
                    <SmRoundedBtn text="4층" status={0} />
                    <SmRoundedBtn text="5층" status={0} />
                </div>
                <div className="flex flex-col mx-[20px] my-[24px] gap-[48px]">
                    <RoomItem RoomName="101호" RoomStatusList={Array.from({ length: 36 }, () => 0)} />
                </div>

                <div className="flex flex-col mx-[20px] my-[24px] gap-[48px]">
                    <RoomItem RoomName="102호" RoomStatusList={Array.from({ length: 36 }, () => 0)} />
                </div>

                <div className="flex flex-col mx-[20px] my-[24px] gap-[48px]">
                    <RoomItem RoomName="103호" RoomStatusList={Array.from({ length: 36 }, () => 0)} />
                </div>
            </main>

            <BottomNav activeIndex={1} />

        </div>
        </Suspense>
    );
};

export default RoomStatus;
