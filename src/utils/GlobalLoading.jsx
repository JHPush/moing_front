import { useLoading } from '../contexts/LoadingContext';

const GlobalLoading = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center">
            <div className="text-white text-lg animate-pulse">로딩 중입니다...</div>
        </div>
    );
};

export default GlobalLoading;
