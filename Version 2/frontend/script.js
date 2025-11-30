function analyze() {
    document.getElementById("analysisForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const coin = document.getElementById("coinSelect").value;
        const pumpPrice = document.getElementById("pumpPrice").value;
        const pumpVolume = document.getElementById("pumpVolume").value;
        const dumpPrice = document.getElementById("dumpPrice").value;
        const dumpVolume = document.getElementById("dumpVolume").value;
    
        // Redirect to backend with parameters
        const query = `coin=${coin}&pump_price=${pumpPrice}&pump_volume=${pumpVolume}&dump_price=${dumpPrice}&dump_volume=${dumpVolume}`;
        window.location.href = `https://himanshu4503srivastav24055sita.pythonanywhere.com/analyze?${query}`;
        // window.location.href = `http://127.0.0.1:5000/analyze?${query}`;
    });
}