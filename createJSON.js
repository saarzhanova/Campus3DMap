async function fetchAndParseJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
        throw error;
    }
}

let campusTracesDesLignes = []
let campusLignes = ["C01408", "C00075", "C01569", "C01567", "C01571"]
const traces = 'assets/json/traces-des-lignes-de-transport-en-commun-idfm.json';
const campusValidationData = 'assets/json/campusValidationData.json';

Promise.all([fetchAndParseJSON(traces), fetchAndParseJSON(campusValidationData)])
    .then(([traces, campusValidationData]) => {
        console.log('traces:', traces);
        console.log('campusValidationData:', campusValidationData);
        for (let i in traces) {
            for (let j in campusLignes) {
                if (traces[i].id_ilico === campusLignes[j]) {
                    campusTracesDesLignes.push(traces[i])
                }
            }
        }
        console.log(campusTracesDesLignes)

        const jsonString = JSON.stringify(campusTracesDesLignes, null, 2); // null and 2 for pretty formatting

        const blob = new Blob([jsonString], { type: 'application/json' });

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'campusTracesDesLignes.json';
        a.click();

    })
    .catch(error => {
        console.error('Error fetching or parsing JSON files:', error);
    });