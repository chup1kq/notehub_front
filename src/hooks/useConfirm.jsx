import { useState } from "react";
import { createPortal } from "react-dom";
import { ConfirmationModal } from "../components/modals/ConfirmationModal";

export const useConfirm = () => {
    const [modalState, setModalState] = useState({
        show: false,
        message: "",
        resolve: null
    });

    const confirm = (message) => {
        return new Promise((resolve) => {
            setModalState({ show: true, message, resolve });
        });
    };

    const handleConfirm = () => {
        modalState.resolve(true);
        setModalState({ ...modalState, show: false, resolve: null });
    };

    const handleCancel = () => {
        modalState.resolve(false);
        setModalState({ ...modalState, show: false, resolve: null });
    };

    const modal = modalState.show
        ? createPortal(
            <ConfirmationModal
                show={modalState.show}
                message={modalState.message}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />,
            document.body
        )
        : null;

    return { confirm, modal };
};
