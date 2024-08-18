function encodeData() {
    const dataInput = document.getElementById("dataInput").value.split("");

    const unipolarCanvas = document.getElementById("unipolarCanvas");
    const nrziCanvas = document.getElementById("nrziCanvas");
    const nrzlCanvas = document.getElementById("nrzlCanvas");
    const manchesterCanvas = document.getElementById("manchesterCanvas");
    const differentialManchesterCanvas = document.getElementById("differentialManchesterCanvas");

    const unipolarCtx = unipolarCanvas.getContext("2d");
    const nrziCtx = nrziCanvas.getContext("2d");
    const nrzlCtx = nrzlCanvas.getContext("2d");
    const manchesterCtx = manchesterCanvas.getContext("2d");
    const differentialManchesterCtx = differentialManchesterCanvas.getContext("2d");

    unipolarCtx.clearRect(0, 0, unipolarCanvas.width, unipolarCanvas.height);
    nrziCtx.clearRect(0, 0, nrziCanvas.width, nrziCanvas.height);
    nrzlCtx.clearRect(0, 0, nrzlCanvas.width, nrzlCanvas.height);
    manchesterCtx.clearRect(0, 0, manchesterCanvas.width, manchesterCanvas.height);
    differentialManchesterCtx.clearRect(0, 0, differentialManchesterCanvas.width, differentialManchesterCanvas.height);

    const unitWidth = 40;
    const midHeight = 75;
    const highLevel = 25;
    const lowLevel = 125;

    function drawLabels(ctx, levels, canvas) {
        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        levels.forEach(level => {
            ctx.fillText(level.label, 5, level.y + 5);  
        });
        dataInput.forEach((bit, index) => {
            const x = index * unitWidth + unitWidth / 2 + 40 - 5;
            ctx.fillText(bit, x, canvas.height - 10);
        });
    }

    function drawYAxis(ctx, levels, canvas) {
        ctx.beginPath();
        levels.forEach(level => {
            ctx.moveTo(40, level.y);
            ctx.lineTo(canvas.width, level.y);
        });
        ctx.strokeStyle = '#ddd';
        ctx.stroke();
    }

    const unipolarLevels = [
        {label: '+V', y: highLevel},
        {label: '0', y: midHeight}
    ];

    const polarLevels = [
        {label: '+V', y: highLevel},
        {label: '0', y: midHeight},
        {label: '-V', y: lowLevel}
    ];

    // Draw Unipolar Encoding
    drawYAxis(unipolarCtx, unipolarLevels, unipolarCanvas);
    unipolarCtx.beginPath();
    unipolarCtx.moveTo(40, midHeight);
    unipolarCtx.lineWidth = 2;
    unipolarCtx.strokeStyle = 'red';
    dataInput.forEach((bit, index) => {
        const x = index * unitWidth + 40;
        const y = bit === "1" ? highLevel : midHeight;
        unipolarCtx.lineTo(x, y);
        unipolarCtx.lineTo(x + unitWidth, y);
    });
    unipolarCtx.stroke();
    drawLabels(unipolarCtx, unipolarLevels, unipolarCanvas);

    // Draw Polar NRZ-I Encoding
    drawYAxis(nrziCtx, polarLevels, nrziCanvas);
    nrziCtx.beginPath();
    nrziCtx.lineWidth = 2;
    nrziCtx.strokeStyle = 'green';
    let currentLevel = highLevel; 
    nrziCtx.moveTo(40, currentLevel);
    dataInput.forEach((bit, index) => {
        const x = index * unitWidth + 40;
        if (bit === "1") {
            currentLevel = currentLevel === lowLevel ? highLevel : lowLevel;
        }
        nrziCtx.lineTo(x, currentLevel);
        nrziCtx.lineTo(x + unitWidth, currentLevel);
    });
    nrziCtx.stroke();
    drawLabels(nrziCtx, polarLevels, nrziCanvas);

    // Draw Polar NRZ-L Encoding
    drawYAxis(nrzlCtx, polarLevels, nrzlCanvas);
    nrzlCtx.beginPath();
    nrzlCtx.lineWidth = 2;
    nrzlCtx.strokeStyle = 'blue';
    nrzlCtx.moveTo(40, midHeight);
    dataInput.forEach((bit, index) => {
        const x = index * unitWidth + 40;
        const y = bit === "1" ? lowLevel : highLevel;
        nrzlCtx.lineTo(x, y);
        nrzlCtx.lineTo(x + unitWidth, y);
    });
    nrzlCtx.stroke();
    drawLabels(nrzlCtx, polarLevels, nrzlCanvas);

    // Draw Manchester Encoding
    drawYAxis(manchesterCtx, polarLevels, manchesterCanvas);
    manchesterCtx.beginPath();
    manchesterCtx.lineWidth = 2;
    manchesterCtx.strokeStyle = 'orange';
    dataInput.forEach((bit, index) => {
        const x = index * unitWidth + 40;
        const midX = x + unitWidth / 2;
        if (bit === "0") {
            manchesterCtx.moveTo(x, midHeight);
            manchesterCtx.lineTo(midX, lowLevel);
            manchesterCtx.lineTo(x + unitWidth, highLevel);
        } else {
            manchesterCtx.moveTo(x, midHeight);
            manchesterCtx.lineTo(midX, highLevel);
            manchesterCtx.lineTo(x + unitWidth, lowLevel);
        }
    });
    manchesterCtx.stroke();
    drawLabels(manchesterCtx, polarLevels, manchesterCanvas);

    // Draw Differential Manchester Encoding
    drawYAxis(differentialManchesterCtx, polarLevels, differentialManchesterCanvas);
    differentialManchesterCtx.beginPath();
    differentialManchesterCtx.lineWidth = 2;
    differentialManchesterCtx.strokeStyle = 'violet';
    let lastLevel = highLevel;
    differentialManchesterCtx.moveTo(40, lastLevel);
    dataInput.forEach((bit, index) => {
        const x = index * unitWidth + 40;
        const midX = x + unitWidth / 2;
        if (bit === "0") {
            differentialManchesterCtx.lineTo(midX, lastLevel);
            lastLevel = lastLevel === highLevel ? lowLevel : highLevel;
            differentialManchesterCtx.lineTo(x + unitWidth, lastLevel);
        } else {
            lastLevel = lastLevel === highLevel ? lowLevel : highLevel;
            differentialManchesterCtx.lineTo(midX, lastLevel);
            differentialManchesterCtx.lineTo(x + unitWidth, lastLevel);
        }
    });
    differentialManchesterCtx.stroke();
    drawLabels(differentialManchesterCtx, polarLevels, differentialManchesterCanvas);
}