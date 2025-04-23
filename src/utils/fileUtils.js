
export const convertUrlToFile = async (url) => {
    try {
        const response = await fetch(url); // URL에서 데이터 가져오기
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob(); // Blob 형태로 데이터 변환
        const filename = url.split("/").pop()
        const file = new File([blob], filename, { type: blob.type }); // Blob을 File 객체로 변환

        return file; // 일반 파일 객체 반환
    } catch (error) {
        console.error("변환 실패:", error);
    }
};

export const convertUrlsToFiles = async (urls) => {
    if (!urls || urls.length === 0) {
        console.error('변환할 파일 없음');
        return [];
    }

    try {
        const filePromises = urls.map(async (url) => {
            try {
                const res = await fetch(url);
                
                if (!res.ok) {
                    console.error(`HTTP Error : ${res.status} - ${url}`);
                    return null;
                }

                const blob = await res.blob();
                const filename = new URL(url).pathname.split('/').pop() || 'default_filename';

                return new File([blob], filename, { type: blob.type || 'application/octet-stream' });
            } catch (error) {
                console.error(`Failed To File Convert: ${url}`, error);
                return null;
            }
        });

        const files = await Promise.all(filePromises);
        return files.filter(file => file !== null);
    } catch (error) {
        console.error('URL to File Failed : ', error);
        return [];
    }
};