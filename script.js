let secondstoDest;

function creatingElement(element) {
    return document.createElement(element);
}

function getDestId(destination) {
    const url = `https://api.resrobot.se/v2/location.name.json?key=358f023f-767a-435c-9974-1cca25df5758&input=${destination}`;

    fetch(url)

        .then((resp) => resp.json())
        .then(function (data) {

            let startlongtitude = 18.05811;
            let startlattitude = 59.32000;
            let longitude = data.StopLocation[0].lon;
            let lattitude = data.StopLocation[0].lat;

            useCoord(longitude, lattitude, startlattitude, startlongtitude);

        })
        .catch(function (error) {
            console.log(error);
        })
}
function useCoord(longitude, lattitude, startlattitude, startlongitude) {

    const url = `https://api.resrobot.se/v2/trip?key=358f023f-767a-435c-9974-1cca25df5758&originCoordLat=${startlattitude}&originCoordLong=${startlongitude}&destCoordLat=${lattitude}&destCoordLong=${longitude}&format=json`;

    fetch(url)

        .then((resp) => resp.json())
        .then(function (data) {

            let originTime = data.Trip[0].LegList.Leg[0].Origin.time;
            let destinationTime = data.Trip[0].LegList.Leg[0].Destination.time;

            console.log(originTime);
            console.log(destinationTime);

            const oTime = calculate(originTime);
            const dTime = calculate(destinationTime);

            secondstoDest = dTime;
            if (secondstoDest != undefined) {
                
                console.log(secondstoDest);
            }

        })
        .catch(function (error) {
            console.log(error);
        })
}
function calculate(time) {
    const arr = time.split(":");
    const seconds = arr[0] * 3600 + arr[1] * 60 + (+arr[2]);

    return seconds;
}
function getDestination(event) {

    let destination = document.getElementById("searchinput").value;

    getDestId(destination);
    getID(destination);

    document.getElementById("numb").innerHTML = '';
    document.getElementById("text").innerHTML = '';
    document.getElementById("min").innerHTML = '';
}

// event.preventDefault();


setInterval(getDestination, 60000)


function getID(destination) {
    const url = `http://api.sl.se/api2/typeahead.json?key=50f2bd202a09473b93f699dbe808b668&searchstring=${destination}&stationsonly=true`;

    fetch(url)

        .then((resp) => resp.json())
        .then(function (data) {
            let id = data.ResponseData[0].SiteId;

            document.getElementById("headmain").innerHTML = data.ResponseData[0].Name;

            useData(id, data.ResponseData[0].Name);
        })
        .catch(function (error) {
            console.log(error);
        })
}
function useData(id, station) {

    document.getElementById("numb").innerHTML = '';
    document.getElementById("text").innerHTML = '';
    document.getElementById("min").innerHTML = '';
    const url = `http://api.sl.se/api2/realtimedeparturesv4.json?key=c27ae9f15506493b92392470334802a7&siteid=${id}&timewindow=20`;

    let timetable = { Station: station, Depatures: [] };

    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {

            let allData = data.ResponseData;


            let transports = [allData.Metros, allData.Buses, allData.Trains]

            transports.forEach(mode => {
                mode.forEach(a => {
                    let departure = {
                        Destination: a.Destination,
                        Expected: a.ExpectedDateTime,
                        Line: a.LineNumber,
                        DisplayTime: a.DisplayTime,
                        Transport: a.TrasportMode
                    };
                    timetable.Depatures.push(departure);
                });
            });

            sortOnDate(timetable);
            console.log(timetable);

            timetable.Depatures.forEach(deps => {

                let unsliced = deps.Expected;
                const dateStr = unsliced,

                    [yyyy, mm, dd, hh, mi, sec] = dateStr.split(/[/:\-T]/)

                let sliced = calculate(`${hh}:${mi}:${sec}`);

                if (secondstoDest != undefined) {
                    
                    console.log(secondstoDest);
                }
                if (secondstoDest <= sliced) {

                    console.log("DU HANN!" + sliced + 'SEK' + '<' + secondstoDest + 'SEK');



                    lineNumber = creatingElement('div');
                    destinationName = creatingElement('div');
                    time = creatingElement('div');

                    lineNumber.innerHTML = deps.Line;
                    destinationName.innerHTML = deps.Destination;
                    time.innerHTML = deps.DisplayTime;

                    document.getElementById("numb").appendChild(lineNumber);
                    document.getElementById("text").appendChild(destinationName);
                    document.getElementById("min").appendChild(time);


                }
                else if (secondstoDest >= sliced) {
                    console.log("DU HANN INTE TYVÄRR" + sliced + 'SEK' + '>' + secondstoDest + 'SEK')
                }
            });


        })
        .catch(function (error) {
            console.log(error);
        })

}

function sortOnDate(timetable) {
    timetable.Depatures.sort(function (a, b) {
        return new Date(a.Expected) - new Date(b.Expected);
    })
}
