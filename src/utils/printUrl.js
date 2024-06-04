export const printPdf = function (url) {
    
    let iframe  = document.createElement('iframe');
    document.body.appendChild(iframe);

    iframe.style.display = 'none';
    iframe.onload = () => {
        setTimeout(() => {
            iframe.focus();
            iframe.contentWindow.print();
        }, 1);
    };
    
    iframe.src = url;
}