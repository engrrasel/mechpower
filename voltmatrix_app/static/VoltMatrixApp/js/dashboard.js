document.getElementById('btn-sim').addEventListener('click', function() {
    // ১. ফর্ম ভ্যালু রিড করা
    const load = parseFloat(document.getElementById('vm-load').value) || 0;
    const solar = parseFloat(document.getElementById('vm-solar').value) || 0;
    const hours = parseFloat(document.getElementById('vm-hours').value) || 12;
    const tariff = parseFloat(document.getElementById('vm-tariff').value) || 8.5;

    // ২. সোলার জেনারেশন এবং গ্রিড ভাগ করার ফর্মুলা
    let solarGen = Math.min(solar * 0.75, load); // Peak output approx 75%
    let gridDemand = Math.max(0, load - solarGen);

    // ৩. লাইভ ড্যাশবোর্ড আপডেট করা
    document.getElementById('pf-solar-kw').innerText = solarGen.toFixed(1) + " kW";
    document.getElementById('pf-load-kw').innerText = load.toFixed(1) + " kW";
    document.getElementById('pf-grid-kw').innerText = gridDemand.toFixed(1) + " kW";

    // গ্রিড কার্ডের স্ট্যাটাস হ্যান্ডেল করা
    const gridStatus = document.getElementById('pf-grid-st');
    if (gridDemand > 0) {
        gridStatus.innerText = "SUPPLEMENTING";
        gridStatus.style.color = "#ef4444";
    } else {
        gridStatus.innerText = "STANDBY";
        gridStatus.style.color = "#64748b";
    }

    // ৪. প্রায়োরিটি রো আপডেট
    document.getElementById('pri-solar-kw').innerText = solarGen.toFixed(1) + " kW";
    document.getElementById('pri-grid-kw').innerText = gridDemand.toFixed(1) + " kW";
    
    let solarPct = load > 0 ? ((solarGen / load) * 100) : 0;
    let gridPct = load > 0 ? ((gridDemand / load) * 100) : 0;

    document.getElementById('pct-solar').innerText = solarPct.toFixed(0) + "% of load";
    document.getElementById('pct-grid').innerText = gridPct.toFixed(0) + "% of load";

    // ৫. KPI ও সেভিংস ক্যালকুলেশন
    let monthlySavings = solarGen * hours * 30 * tariff;
    let annualCO2 = (solarGen * hours * 365 * 0.4) / 1000;
    let estimatedPayback = solar > 0 ? ( (solar * 85000) / (monthlySavings * 12) ) : 0;

    document.getElementById('kpi-savings').innerHTML = monthlySavings.toLocaleString('en-IN', {maximumFractionDigits:0}) + " <span>BDT</span>";
    document.getElementById('kpi-bill-red').innerText = solarPct.toFixed(0) + "%";
    document.getElementById('kpi-co2').innerText = annualCO2.toFixed(1) + " T";
    document.getElementById('kpi-payback').innerText = estimatedPayback > 0 ? estimatedPayback.toFixed(1) + " yrs" : "—";

    // ৬. আর্কে বা গজ মিটার (Gauge Chart Simulation)
    let totalArcLength = 188.5; // (PI * r)
    
    // Performance Ratio 
    let effPct = solar > 0 ? 82 : 0; // standard performance efficiency ratio
    let effOffset = totalArcLength - (totalArcLength * (effPct / 100));
    document.getElementById('gauge-eff-arc').style.strokeDashoffset = effOffset;
    document.getElementById('gauge-eff-txt').innerText = effPct + "%";

    // Solar Fraction
    let sfOffset = totalArcLength - (totalArcLength * (solarPct / 100));
    document.getElementById('gauge-sf-arc').style.strokeDashoffset = sfOffset;
    document.getElementById('gauge-sf-txt').innerText = solarPct.toFixed(0) + "%";

    // ৭. চার্ট এরিয়া আপডেট
    document.getElementById('vm-chart').innerHTML = `<strong>Data Generated:</strong> Solar Consumption: ${(solarGen*hours*30).toFixed(0)} kWh/mo | Grid: ${(gridDemand*hours*30).toFixed(0)} kWh/mo`;
});