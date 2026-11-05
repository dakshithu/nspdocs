// JavaScript to allocate Nyasam, Dhyanam, and Shlokas for a satsang event
// Ensures all participants are assigned correctly and avoids unnecessary repetition

function allocaterrs() {
    // Save user input before processing
    tempSave();
    
    let batchNumber = window.localStorage.getItem("nsp-batchnumber");
    let satsangDate = window.localStorage.getItem("nsp-satsangdate");
    let txtNames = document.getElementById('names').value;
    
    // Validate if required fields are provided
    if (!batchNumber || !satsangDate || !txtNames.trim()) {
        alert("Please enter Batch Number, Satsang Date, and Names before proceeding!");
        return;
    }

    // Process names: Remove spaces and empty lines
    let splittedLines = txtNames.split('\n').map(name => name.trim()).filter(name => name !== "");
    if (splittedLines.length === 0) {
        alert('There are no people to allocate!');
        return;
    }
    
    allocateShlokas(splittedLines);
}
function clearNames() {
  document.getElementById('names').value = '' ;
}

// Function to save user input in local storage
function tempSave() {
    window.localStorage.setItem("nsp-names", document.getElementById('names').value);
    window.localStorage.setItem("nsp-batchnumber", document.getElementById('batchnumber').value);
    window.localStorage.setItem("nsp-satsangdate", document.getElementById('satsangdate').value);
}

// Function to allocate shlokas to participants
function allocateShlokas(names) {
    const mahaMantras = 38; // Total shlokas per avarthi
	let actualParticipantsofAvarthi = 0; //avarthi actual allocation after division of shlokas by people
    let csvContent = `Batch Number,,${window.localStorage.getItem("nsp-batchnumber")},,Date,${window.localStorage.getItem("nsp-satsangdate")}\n\n`;
    csvContent += "Shlokam, Start, End, Count, Devotee Name\n\n";
    let outputText = "*Om Namo Narayana* \n--------------------------------------------\n";

    let batchNumber = window.localStorage.getItem("nsp-batchnumber");
    let satsangDate = window.localStorage.getItem("nsp-satsangdate");
    outputText += `Batch Number: ${batchNumber}  [Satsang Date: ${satsangDate}]\n--------------------------------------------\n\n`;
	
    let avarthiCount = 1;
    let currentIndex = 0;
    const reserveNSP = names[0].toUpperCase() === 'NSP';
    const participants = reserveNSP
        ? names.filter(name => name.toUpperCase() !== 'NSP')
        : names;
    if (!participants.length) {
        document.getElementById('allocation').value = '';
        window.localStorage.removeItem('csvData');
        alert('Add at least one participant after NSP to receive the remaining portions.');
        return;
    }
    const backupNames = names.length > 10 ? names.slice(10) : names;
    const remainingNames = reserveNSP
        ? backupNames.filter(name => name.toUpperCase() !== 'NSP')
        : backupNames;
    if (!remainingNames.length) remainingNames.push(...participants);
    names = participants;
	   // Select a random starting prayer person from available names
    let startingPrayerPerson = names[Math.floor(Math.random() * names.length)];
    outputText += `\Starting Prayer: ${startingPrayerPerson}\n`;
    csvContent += `\Starting Prayer,,,${startingPrayerPerson}\n`;

    console.log(outputText);



    while (currentIndex < names.length) {
        outputText += `\nAvarthi-${avarthiCount}\n`;
		csvContent += `\nAvarthi-${avarthiCount}\n`;
		        
        // Select names for the current avarthi (Nyasa, Dhyaanam, and Shlokams)
        let selectedNames = names.slice(currentIndex, currentIndex + mahaMantras + 2);
		
		
         console.log('\n selectedNames:\n', selectedNames, 'selectedNames.length:', selectedNames.length,'\n');
        // Ensure at least 3 names are available for Nyasam, Dhyanam, and Shlokam allocation
        while (selectedNames.length < 3) {
            let extraNames = remainingNames.sort(() => 0.5 - Math.random()).slice(0, 3 - selectedNames.length);
            selectedNames.push(...extraNames);
        }
 
        outputText += `Nyasa: ------------------${selectedNames[0]}\n`;
        outputText += `Dhyaanam: 1--------------${selectedNames[1]}\n\n`;
        csvContent += `Nyasa,,,${selectedNames[0]}\n`;
        csvContent += `Dhyaanam,,,${selectedNames[1]}\n\n`;

        let startShloka = 1;
        let shlokaAllocation = selectedNames.slice(2);
        const reservedPortions = reserveNSP && avarthiCount === 1 ? 1 : 0;
        if (reservedPortions) shlokaAllocation.unshift('NSP');

        // Ensure we allocate 38 shlokas by adding extra names if needed (excluding the first 10 names)
        const unusedNames = remainingNames.filter(name => !selectedNames.includes(name));
        const backupPool = unusedNames.length ? unusedNames : remainingNames;
        while (shlokaAllocation.length < mahaMantras) {
            const shuffled = backupPool.slice().sort(() => 0.5 - Math.random());
            shlokaAllocation.push(...shuffled.slice(0, mahaMantras - shlokaAllocation.length));
        }
        let remainingShlokas = mahaMantras;
        let remainingParticipants = shlokaAllocation.length;
		 let shlokasPerPerson = 0;
		if(Math.floor(remainingShlokas/remainingParticipants) == 1){
		shlokasPerPerson = 2; }
		else {
        shlokasPerPerson = Math.min(5, Math.floor(remainingShlokas / remainingParticipants));}

        console.log(`Processing Avarthi ${avarthiCount}, Total Participants: ${shlokaAllocation.length}`);

        for (let i = 0; i < shlokaAllocation.length; i++) {
            let endShloka = startShloka + shlokasPerPerson - 1;
            if (endShloka > mahaMantras) endShloka = mahaMantras;

            outputText += `Shlokam: ${startShloka}-${endShloka}-[${endShloka - startShloka + 1}]---------${shlokaAllocation[i]}\n`;
            csvContent += `Shlokam, ${startShloka}, ${endShloka}, ${endShloka - startShloka + 1}, ${shlokaAllocation[i]}\n`;

            startShloka = endShloka + 1;
            remainingShlokas -= (endShloka - startShloka + 1);
            remainingParticipants--;
			actualParticipantsofAvarthi++;

            if (startShloka > mahaMantras) break;

            if (remainingParticipants > 0) {
				if(Math.ceil(remainingShlokas / remainingParticipants) == 1){
				shlokasPerPerson = 2;}
				else {
                shlokasPerPerson = Math.min(5, Math.ceil(remainingShlokas / remainingParticipants));
				}
            }
        }

        currentIndex += actualParticipantsofAvarthi + 2 - reservedPortions;
		actualParticipantsofAvarthi = 0;
        avarthiCount++;
			 console.log('currentIndex:',currentIndex,' avarthiCount:', avarthiCount, ' startShloka:', startShloka, 'names total:', names.length);
    }

    // Select a random ending prayer person from available names
    let endingPrayerPerson = names[Math.floor(Math.random() * names.length)];
    outputText += `\nEnding Prayer: ${endingPrayerPerson}\n`;
    csvContent += `\nEnding Prayer,,,${endingPrayerPerson}\n`;

    console.log(outputText);
    document.getElementById('allocation').value = outputText;
    window.localStorage.setItem("csvData", csvContent);
}

// Function to load stored names into the input field
function loadPeople() {
    let storedNames = window.localStorage.getItem("nsp-names");
    if (storedNames) {
        document.getElementById('names').value = storedNames;
    }
}

// Function to download CSV output
function downloadCSV() {
    let csvData = window.localStorage.getItem("csvData");
    if (!csvData) {
        alert("No CSV data available to download!!");
        return;
    }
    let blob = new Blob([csvData], { type: 'text/csv' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'rrs_allocation.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
