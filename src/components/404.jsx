import { useTranslation } from "../hooks/useTranslation";

export const NotFound = () => {
    const { t } = useTranslation();

    return (
        <>
            <div className={"container"}>
                <div className="not-found">
                    <div>
                        <h1>404</h1>
                    </div>
                    <div className="not-found-info">
                        <p>{t('notFound.message')}</p>
                    </div>
                </div>
            </div>
        </>
    );
};
