import { BsEye, BsEyeSlash } from "react-icons/bs";
import React, { useState } from "react";

export const PasswordInput = ({value, onChange, placeholder, className = ""}) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="auth-input-wrapper">
            <input
                type={visible ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`auth-input ${className}`}
            />
            <span
                className="auth-input-icon"
                onClick={() => setVisible(v => !v)}
            >
                {visible ? <BsEye /> : <BsEyeSlash />}
            </span>
        </div>
    );
};
