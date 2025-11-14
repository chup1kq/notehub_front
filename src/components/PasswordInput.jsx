import {BsEye, BsEyeSlash} from "react-icons/bs";
import React, {useState} from "react";

export const PasswordInput = ({value, onChange}) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <div className={`position-relative mb-2`}>
            <input
                className="form-control pe-4"
                onChange={onChange}
                type={passwordVisible ? "text" : "password"}
                placeholder={'Password'}
                value={value}
            />
            <span
                className="position-absolute top-50 end-0 translate-middle-y me-2"
                style={{cursor: 'pointer'}}
                onMouseDown={() => setPasswordVisible(true)}
                onMouseUp={() => setPasswordVisible(false)}
                onMouseLeave={() => setPasswordVisible(false)}
            >
                {passwordVisible ? <BsEye/> : <BsEyeSlash/>}
            </span>
        </div>
    );
};