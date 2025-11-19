import React from "react";
import PropTypes from "prop-types";
import "../../static/styles/modals/ModalWindow.scss";

export const ConfirmationModal = ({ show, message, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-window">
                <div className="modal-body">
                    <p className="modal-message">{message}</p>
                </div>

                <div className="modal-footer" style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button className="modal-btn" onClick={onConfirm}>
                        Продолжить
                    </button>
                    <button className="modal-btn cancel" onClick={onCancel}>
                        Отмена
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
