document.getElementById('generateBtn').addEventListener('click', () => {
    document.getElementById('generateSection').style.display = 'block';
    document.getElementById('scanSection').style.display = 'none';
});

document.getElementById('scanBtn').addEventListener('click', () => {
    document.getElementById('scanSection').style.display = 'block';
    document.getElementById('generateSection').style.display = 'none';
});

document.getElementById('generateQrBtn').addEventListener('click', () => {
    const data = document.getElementById('qrData').value;
    if (!data) {
        alert('Please enter data for the QR code.');
        return;
    }
    generateQRCode(data);
});

document.getElementById('scanQrBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('qrImage');
    if (fileInput.files.length === 0) {
        alert('Please upload an image containing a QR code.');
        return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            scanQRCode(img);
        };
    };
    reader.readAsDataURL(file);
});

function generateQRCode(data) {
    const qrCanvas = document.getElementById('qrCanvas');
    const ctx = qrCanvas.getContext('2d');
    qrCanvas.width = 300;
    qrCanvas.height = 300;

    const qr = qrcode(0, 'M');
    qr.addData(data);
    qr.make();

    ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';

    for (let row = 0; row < qr.getModuleCount(); row++) {
        for (let col = 0; col < qr.getModuleCount(); col++) {
            ctx.beginPath();
            ctx.rect(col * 10, row * 10, 10, 10);
            ctx.fillStyle = qr.isDark(row, col) ? '#000000' : '#ffffff';
            ctx.fill();
            ctx.closePath();
        }
    }

    document.getElementById('logoUpload').style.display = 'block';
    document.getElementById('logoFile').addEventListener('change', (event) => {
        const logoFile = event.target.files[0];
        if (logoFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const logoImg = new Image();
                logoImg.src = e.target.result;
                logoImg.onload = () => {
                    const logoSize = Math.min(qrCanvas.width, qrCanvas.height) * 0.3;
                    ctx.drawImage(logoImg, (qrCanvas.width - logoSize) / 2, (qrCanvas.height - logoSize) / 2, logoSize, logoSize);
                };
            };
            reader.readAsDataURL(logoFile);
        }
    });
}

function scanQRCode(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
        document.getElementById('scanResult').textContent = `QR Code Data: ${code.data}`;
    } else {
        document.getElementById('scanResult').textContent = 'QR code not detected or invalid.';
    }
}