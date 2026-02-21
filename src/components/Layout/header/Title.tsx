"use client";

import React from "react";
import "@/styles/globals.css";

interface TitleProps {
    children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => {
    return (
        <h1 className= "text-Lm" >
            {children}
        </h1>
    );
};

export default Title;
