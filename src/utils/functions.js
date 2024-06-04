export const base64toBlob = (data, type = 'application/pdf') => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substr(`data:${type};base64,`.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type });
};

export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});