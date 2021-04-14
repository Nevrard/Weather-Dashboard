var userInput= document.getElementById("userInput")
var searchEl= document.getElementById("searchBtn")
var resultEl= document.querySelector(".jumbotron")
var forecastEl=document.querySelector("#forecast-result")
var apiKey="a78307cbc045f700eaa945de19daab4a"
var clearEl=document.getElementById("clear")
var uvIndexEl=document.getElementById("uvIndex")
var placesHistory= [];
var historyEl= document.getElementById("SearchedPlaces")

//Get and displays names of places stored on the Local Storage
function renderHistory(){
    var places = localStorage.getItem('myHistory')
    historyEl.innerHTML="";
    if (places) {
      placesHistory = JSON.parse(places)
    }
    console.log(placesHistory)
    for(var i=0;i<placesHistory.length;i++)
      {
          console.log(placesHistory[i])
          var li = document.createElement("li");
        li.classList.add("list-group-item")
        li.classList.add("hover-shadow")
         li.textContent = placesHistory[i]
        
        historyEl.appendChild(li);
        clearEl.style.display="Block"
        
  //EventListener on Each element in the searched History
        li.addEventListener("click",function(event){
          var place=event.target.textContent
          getWeather(place)
          fiveDaysForecast(place)
     
             })
        }

       
    }
 
    init()
//Event listener on Serach button
searchEl.addEventListener("click",renderWeather)

//Event Listener to clear button to clear Searched Places History
clearEl.addEventListener("click",function(){
    localStorage.clear();
    location.reload(true);
  });

  // function called when Search is clicked
function renderWeather()
{
    
   var place=(userInput.value.trim())
   getWeather(place)
   fiveDaysForecast(place)

}

//Function that fetch and displays current Weather data 
function  getWeather (place) {
      var Url = 'https://api.openweathermap.org/data/2.5/weather?q=' + place + '&units=imperial&appid=' + apiKey;
   
      fetch(Url)
      .then(function (response) {
      if (response.ok) {
            response.json().then(function (data) {
            console.log(data)

        var currentDate= moment().format("MM/DD/YYYY")
        var iconSrc = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
        document.getElementById("placeName").textContent=data.name+" ("+ currentDate+" )";
        document.getElementById("icon").setAttribute("src",iconSrc)

        var tempData= data.main.temp.toFixed(0)
        document.getElementById("temperature").textContent="Temperature: "+tempData+ " °F"
        document.getElementById("humidity").textContent="Humidity: "+ data.main.humidity+ " %"
        document.getElementById("windSpeed").textContent="Wind Speed :" +data.wind.speed+ " MPH"
        
    var uvIUrl = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + data.coord.lat+ '&lon=' + data.coord.lon + '&appid=' + apiKey;

        fetch(uvIUrl)
            .then(function (response) {
            if (response.ok) {
                    response.json().then(function (data) {
                    console.log(data)
                    uvIndexEl.textContent= data.value 
                    if (data.value <= 2) {
                        uvIndexEl.style.background="green"
                      } else if (data.value <= 5) {
                        uvIndexEl.style.background="Yellow"
                      } else if (data.value <= 7) {
                        uvIndexEl.style.background="Orange"
                      } else  {
                        uvIndexEl.style.background="red"
                      }
            

                    })
                }          
            })
        userInput.value="";
        var lastSearched=data.name
        localStorage.setItem('lastSearched', JSON.stringify(lastSearched));
        var checkPlace=placesHistory.includes(data.name)
        if(checkPlace===false)
            {
                placesHistory.push(data.name)
                localStorage.setItem('myHistory', JSON.stringify(placesHistory));
                renderHistory()
            }
            else{
              renderHistory()
            }
     });
     } else {
          alert('Error: ' + response.statusText);
    }
    })
      .catch(function (error) {
      alert('Unable to connect to Open Weather Map');
 });
 
 resultEl.style.display="block"
 
}


//Function that Fetches and displays the forecast data 
function fiveDaysForecast(place) {
    var fiveForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + place + '&units=imperial&appid=' + apiKey;
  
    fetch(fiveForecastUrl)
    .then(function (response) {
    if (response.ok) {
            response.json().then(function (data) {
            console.log(data)
          
          
         for (i = 0; i < 5; i++) {
           var dateForecast = moment(data.list[((i + 1) * 8)-1].dt_txt).format("MM/DD/YYYY")
            document.getElementById("Date"+i).textContent=dateForecast
          var fiveForecastIcon = data.list[((i + 1) * 8) - 1].weather[0].icon;
          var fiveForcasticonUrl = "https://openweathermap.org/img/wn/"+ fiveForecastIcon + ".png";
          console.log(fiveForecastIcon)
          document.getElementById("icon"+i).setAttribute("src",fiveForcasticonUrl)
          document.getElementById("temperature"+i).textContent="Temperature: "+data.list[((i + 1) * 8) - 1].main.temp.toFixed(0) + " °F"
          document.getElementById("humidity"+i).textContent= "Humidity :"+data.list[((i + 1) * 8) - 1].main.humidity + " %"
               
        } 
        forecastEl.style.display="block"
          
      });
    }
  })

}

function init(){
   var place= JSON.parse(localStorage.getItem('lastSearched'))
 console.log(place)
 if(place){
        getWeather(place)
        fiveDaysForecast(place) 
        renderHistory() 
        }
      
}

 