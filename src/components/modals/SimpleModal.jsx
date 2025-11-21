import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "../../static/styles/modals/ModalWindow.scss";
import { useTranslation } from "../../hooks/useTranslation";

export const SimpleModal = ({ show, message, onClose }) => {
    const { t } = useTranslation();

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter' && show) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-window">
                <div className="modal-body">
                    <p className="modal-message">{message}</p>
                </div>

                <div className="modal-footer">
                    <button className="modal-btn" onClick={onClose}>
                        {t('modals.confirm')}
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
