import React from "react";
import PropTypes from "prop-types";
import "../../static/styles/modals/ModalWindow.scss";
import { useTranslation } from "../../hooks/useTranslation";

export const ConfirmationModal = ({ show, message, onConfirm, onCancel }) => {
    const { t } = useTranslation();

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-window">
                <div className="modal-body">
                    <p className="modal-message">{message}</p>
                </div>

                <div className="modal-footer" style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button className="modal-btn" onClick={onConfirm}>
                        {t('modals.confirm')}
                    </button>
                    <button className="modal-btn cancel" onClick={onCancel}>
                        {t('modals.cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmationModal.propTypes = {
    show: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};
