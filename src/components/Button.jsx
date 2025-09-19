export const Button = ({ text, onClick, style }) => {
    return (
        <button
            className={style}
            type="button"
            onClick={onClick}
        >
            {text}
        </button>
    );
};
