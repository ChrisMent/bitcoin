const API_KEY = '8MHPNQE5RTXZQKZP';


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
      
      // Array zum Speichern der monatlichen Kurse
      let monthlyClosingCourses = [];

      // Durch die Tage des Monats iterieren mit forin - Schleife
      // --> day ist eine temporäre Variable, die den aktuellen Tag (Eigenschaftsschlüssel) während jeder Iteration enthält.
      for (let day in monthlyExRateData) {
        
        // Hier wird der Wert von 4a. close (EUR) für den aktuellen Tag (day) gespeichert
        const closingCourse = monthlyExRateData[day]['4a. close (EUR)'];
        
        // Zum Array hinzufügen
        monthlyClosingCourses.push({
          day: day,
          closingCourse: closingCourse
        });
      }

      console.log(monthlyClosingCourses);
      
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
}

loadMonthlyData();
loadCurrentData();




