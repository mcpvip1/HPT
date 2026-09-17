const App = {
    init() {
        Toast.init();
        Debug.init();

        state.chart = ChartFactory.createMain(document.getElementById('mainChart'));

        state.sensorData = this.generateDemoData();
        state.rawData = state.sensorData.slice();

        Dashboard.showFullResult();
        Dashboard.updateLotBadge();
        Dashboard.setChartMode('color');

        this.bindEvents();
        console.log('[App] Ready · points:', state.sensorData.length);
    },

    bindEvents() {
        document.getElementById('langSelect').addEventListener('change', e => {
            I18n.apply(e.target.value);
            Dashboard.update();
        });

        document.getElementById('debugBtn').addEventListener('click', () => Debug.toggle());
        document.getElementById('debugCloseBtn').addEventListener('click', () => Debug.close());

        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        document.getElementById('fileInput').addEventListener('change', e => this.handleUpload(e));

        document.getElementById('printBtn').addEventListener('click', () => Exporter.print());
        document.getElementById('exportPngBtn').addEventListener('click', () => Exporter.exportPNG());
        document.getElementById('exportPdfBtn').addEventListener('click', () => Exporter.exportPDF());

        document.getElementById('lotNumberInput').addEventListener('input', () => Dashboard.updateLotBadge());

        ['startYear', 'startMonth', 'startDay', 'startHour', 'startMinute',
            'endYear', 'endMonth', 'endDay', 'endHour', 'endMinute'].forEach(id => {
                document.getElementById(id).addEventListener('input', Utils.debounce(() => Dashboard.update(), 200));
            });

        document.getElementById('fullResultBtn').addEventListener('click', () => Dashboard.showFullResult());
        document.getElementById('last24hBtn').addEventListener('click', () => Dashboard.jumpToLast24h());

        ['minThreshold', 'maxThreshold'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => Dashboard.update());
        });

        document.getElementById('modeColorBtn').addEventListener('click', () => Dashboard.setChartMode('color'));
        document.getElementById('modeMonoBtn').addEventListener('click', () => Dashboard.setChartMode('mono'));
    },

    async handleUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        event.target.value = '';

        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(new Uint8Array(buffer), {
                type: 'array', cellDates: true, cellNF: false, cellText: false
            });

            let bestResult = null;
            let bestSheetName = '';
            const debugLines = [];

            for (const sheetName of workbook.SheetNames) {
                const sheet = workbook.Sheets[sheetName];
                if (!sheet) continue;
                const rows = XLSX.utils.sheet_to_json(sheet, {
                    header: 1, blankrows: true, raw: true, defval: null
                });
                if (!rows || rows.length === 0) continue;

                const result = Parser.parse(rows);
                if (result && result.data.length > 0) {
                    debugLines.push(`<strong>Sheet "${sheetName}":</strong> ${result.data.length} rows`);
                    if (!bestResult || result.data.length > bestResult.data.length) {
                        bestResult = result;
                        bestSheetName = sheetName;
                    }
                } else {
                    debugLines.push(`<span style="color:#f87171">Sheet "${sheetName}": no data</span>`);
                }
            }

            if (!bestResult || bestResult.data.length === 0) {
                Toast.error('❌ ' + I18n.t('noValidData'));
                Debug.log(debugLines.join('<br>'));
                return;
            }

            state.sensorData = bestResult.data;
            state.rawData = bestResult.data.slice();

            if (bestResult.lot) {
                document.getElementById('lotNumberInput').value = bestResult.lot;
                Dashboard.updateLotBadge();
            }

            Dashboard.showFullResult();

            const firstTime = bestResult.data[0].time;
            const lastTime = bestResult.data[bestResult.data.length - 1].time;
            const duration = Utils.formatDuration(firstTime, lastTime);

            Toast.success(
                '✅ ' + I18n.t('loadedRows', state.language, { n: bestResult.data.length }) +
                (duration ? ` · Duration: ${duration}` : '')
            );

            Debug.log(
                `<strong>Used sheet:</strong> ${bestSheetName}<br>` +
                `<strong>Parsed rows:</strong> ${bestResult.data.length}<br>` +
                `<strong>Lot:</strong> ${bestResult.lot || '—'}<br>` +
                `<strong>Start:</strong> ${firstTime}<br>` +
                `<strong>End:</strong> ${lastTime}<br>` +
                `<strong>Duration:</strong> ${duration || '—'}<br>` +
                `<strong>Columns:</strong> time=${bestResult._detectedCols.timeCol}, temp=${bestResult._detectedCols.tempCol}<br>` +
                `<strong>All sheets:</strong><br>${debugLines.join('<br>')}`
            );

        } catch (err) {
            console.error(err);
            Toast.error('❌ ' + I18n.t('parseError') + err.message);
        }
    },

    generateDemoData() {
        const out = [];
        const now = new Date();
        now.setHours(16, 10, 0, 0);
        now.setDate(now.getDate() - 2);
        let t = 36.2;
        for (let i = 0; i < 288; i++) {
            out.push({
                time: `${now.getFullYear()}/${Utils.pad2(now.getMonth() + 1)}/${Utils.pad2(now.getDate())}_${Utils.pad2(now.getHours())}:${Utils.pad2(now.getMinutes())}:00`,
                temp: parseFloat(t.toFixed(2))
            });
            t += (Math.random() - 0.5) * 0.4;
            if (t > 37.5) t -= 0.3;
            if (t < 35.8) t += 0.3;
            now.setMinutes(now.getMinutes() + 10);
        }
        return out;
    }
};

window.addEventListener('DOMContentLoaded', () => App.init());