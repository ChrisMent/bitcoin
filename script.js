const API_KEY = '8MHPNQE5RTXZQKZP';
// Array zum Speichern der monatlichen Kurse
let monthlyClosingCourses = [];


// aktuelle Bitcoin Kurse abrufen!
async function loadCurrentData() {
  let url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=EUR&apikey=${API_KEY}`;
  
  try {
    let response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let responseAsJson = await response.json();
    
    // Datenextraktion
    const exchangeRateData = responseAsJson['Realtime Currency Exchange Rate'];
    const fromCurrency = exchangeRateData['1. From_Currency Code'];
    const toCurrency = exchangeRateData['3. To_Currency Code'];
    let exchangeRate = parseFloat(exchangeRateData['5. Exchange Rate']).toFixed(2);

     /// Tausendertrennzeichen einfügen
    exchangeRate = parseFloat(exchangeRate).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    let course = document.getElementById('bitcon-value')
    course.innerHTML = `<b>${exchangeRate} ${toCurrency} </b>` 
    
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }


}

// monatliche Bitcoin Kurse abrufen!
async function loadMonthlyData() {
    let url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=EUR&apikey=${API_KEY}`;
   
    try {
      let response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let responseAsJson = await response.json();
      
      // Datenextraktion
      const monthlyExRateData = responseAsJson['Time Series (Digital Currency Monthly)'];
      
      // Durch die Tage des Monats iterieren mit forin - Schleife
      // --> day ist eine temporäre Variable, die nur jeden Tag aus der Json Datei während jeder Iteration als Text ausließt.
      // 
      for (let day in monthlyExRateData) {
        
        // Originaldatum im Format YYYY-MM-DD wurd ausgelesen. 
        // new Date(day); nimmt den String day, der ein Datum im Format YYYY-MM-DD repräsentiert, und wandelt es in neues Date-Objekt um. Beispiel: Thu Sep 07 2023 00:00:00 GMT+0000 (CUT)

        const originalDate = new Date(day);

        // Jetzt kanns Date-Objekt verwenden, um verschiedene Teile des Datums (Tag, Monat, Jahr usw.) zu extrahieren oder das Datum in ein anderes Format umzuwandeln.

        // Datum im Format DD.MM.YYYY umwandeln

        // getDate(), getMonth(), getFullYear(): Diese Methoden extrahieren den Tag, den Monat und das Jahr aus dem Date-Objekt.
        // padStart(2, '0'): Diese Methode stellt sicher, dass der Tag und der Monat immer zweistellig sind. Wenn der Tag oder Monat nur eine Ziffer hat (z.B. 9 für den 9. Tag), wird eine führende 0 hinzugefügt (also 09).
        // ${...}.${...}.${...}: Dies ist ein Template-String in JavaScript, der es ermöglicht, Variablen direkt in einen String einzufügen.

        const formattedDate = `${originalDate.getDate().toString().padStart(2, '0')}.${(originalDate.getMonth() + 1).toString().padStart(2, '0')}.${originalDate.getFullYear()}`;

        // Hier wird der Wert von 4a. close (EUR) für den aktuellen Tag (day) gespeichert und in ein anderes Format umgewandelt
        let closingCourse = parseFloat(monthlyExRateData[day]['4a. close (EUR)']).toFixed(2);

         /// Tausendertrennzeichen einfügen bei closingCourse
         closingCourse = parseFloat(closingCourse).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
         
        
        // Zum Array hinzufügen
        monthlyClosingCourses.push({
          day: formattedDate,  // Verwenden des umformatierten Datums
          closingCourse: closingCourse
        });
      }

      console.log(monthlyClosingCourses);
      
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
}

function renderChart(){
 
  // Extrahieren Sie die closingCourse Werte
  const closingCourse = monthlyClosingCourses.map(item => item.closingCourse);
  const days = monthlyClosingCourses.map(item => item.day);

  const ctx = document.getElementById('myChart');
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [{
          label: 'Bitcoin Kurs in €',
          data: closingCourse,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  



async function init() {
  await loadCurrentData();
  await loadMonthlyData();
  renderChart();
  // Weitere Initialisierungscodes können hier hinzugefügt werden
}

document.addEventListener("DOMContentLoaded", init);



