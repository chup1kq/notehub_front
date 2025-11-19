import React from "react";
import PropTypes from "prop-types";
import "../../static/styles/modals/ModalWindow.scss";

export const SimpleModal = ({ show, message, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-window">
                <div className="modal-body">
                    <p className="modal-message">{message}</p>
                </div>

                <div className="modal-footer">
                    <button className="modal-btn" onClick={onClose}>
                        Продолжить
                    </button>
                </div>
            </div>
        </div>
    );
};

SimpleModal.propTypes = {
    show: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};
