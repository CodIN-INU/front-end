"use client";

import { useState, useCallback } from "react";
import { ReportModal } from "@/shared/ui";

interface UseReportModal {
    isOpen: boolean;
    openModal: (targetType: string, targetId: string) => void;
    closeModal: () => void;
    getModalComponent: () => JSX.Element | null;
}

/**
 * 신고 모달을 쉽게 열고 닫기 위한 훅
 */
export const useReportModal = (): UseReportModal => {
    const [isOpen, setIsOpen] = useState(false);
    // 예) 'USER' | 'POST' | 'COMMENT' | 'REPLY'
    const [reportTargetType, setReportTargetType] = useState<string>("");
    const [reportTargetId, setReportTargetId] = useState<string>("");

    // 모달 열기
    const openModal = useCallback((targetType: string, targetId: string) => {
        setReportTargetType(targetType);
        setReportTargetId(targetId);
        setIsOpen(true);
    }, []);

    // 모달 닫기
    const closeModal = useCallback(() => {
        setIsOpen(false);
        setReportTargetType("");
        setReportTargetId("");
    }, []);

    // 모달 컴포넌트 가져오기
    const getModalComponent = () => {
        if (!isOpen) return null;
        return (
            <ReportModal
                onClose={closeModal}
                reportTargetType={reportTargetType}
                reportTargetId={reportTargetId}
            />
        );
    };

    return {
        isOpen,
        openModal,
        closeModal,
        getModalComponent,
    };
};

