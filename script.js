let mintoWalk;
function creatingElement(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
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


            const timeString1 = originTime; // input string

            const arr = timeString1.split(":"); // splitting the string by colon

            const seconds = arr[0] * 3600 + arr[1] * 60 + (+arr[2]); // converting

            console.log(seconds);

            const timeString2 = destinationTime; // input string

            const arr2 = timeString2.split(":"); // splitting the string by colon

            const seconds2 = arr2[0] * 3600 + arr2[1] * 60 + (+arr2[2]); // converting

            console.log(seconds2);

            let subraction = (seconds2 - seconds) / 60;

            console.log(subraction);

            mintoWalk = subraction;
            console.log("useCoords-metoden:" + mintoWalk);

        })
        .catch(function (error) {
            console.log(error);
        })
}
function getDestination(event) {
    
    console.log("Inside getDesination");

    document.getElementById("numb").innerHTML = '';
    document.getElementById("text").innerHTML = '';
    document.getElementById("min").innerHTML = '';
    
    if (event.keyCode === 13){
        
        let destination = document.getElementById("searchinput").value;
    }
    event.preventDefault();
    



    getDestId(destination);
    getID(destination);
    
}

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

    const url = `http://api.sl.se/api2/realtimedeparturesv4.json?key=c27ae9f15506493b92392470334802a7&siteid=${id}&timewindow=30`;

    let timetable = { Station: station, Depatures: [] };

    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {

            let allData = data.ResponseData;
            let transports = [allData.Metros, allData.Buses, allData.Trains, allData.Ships]

            transports.forEach(mode => {
                mode.forEach(a => {
                    let departure = {

                        Line = a.LineNumber,
                        Destination = a.Destination,
                        Expected = a.ExpectedDateTime,
                        DisplayTime = a.DisplayTime
                    };
                    timetable.Depatures.push(departure);
                });
            });

            sortOnDate(timetable);

            transports.map(function (deps) {

                lineNumber = creatingElement('div'),
                destinationName = creatingElement('div')
                time = creatingElement('div');

                lineNumber.innerHTML = deps.LineNumber;
                destinationName = deps.Destination;
                time = deps.DisplayTime;
                
                append(numb, lineNumber);
                append(text, destinationName);
                append(min, time);


            })
            
            // let trains = data.ResponseData.Metros;

            // trains.map(function (train) {

            //     let div = creatingElement('div'),
            //         lineNumber = creatingElement('div'),
            //         destinationName = creatingElement('div')
            //     time = creatingElement('div');




            //     // let displaytime = train.DisplayTime;
            //     // let mintoDepature = displaytime.charAt(0);
            //     // let result = mintoDepature - mintoWalk;

            //     // if (result < 0) {
            //     //     result = 0;
            //     //     console.log(result);
            //     // }
            //     // else if (result > 0) {

            //     //     lineNumber.innerHTML = train.LineNumber;
            //     //     destinationName.innerHTML = train.Destination;
            //     //     train.DisplayTime = result + "min";

            //     //     time.innerHTML = train.DisplayTime;
            //     // }

            //     let displaytime = train.DisplayTime;
            //     let mintoDepature = displaytime.charAt(0);
            //     let result = mintoDepature - mintoWalk;

            //     console.log(result);

            //     lineNumber.innerHTML = train.LineNumber;
            //     destinationName.innerHTML = train.Destination;
            //     time.innerHTML = train.DisplayTime;
            //     append(numb, lineNumber);
            //     append(text, destinationName);
            //     append(min, time);

            // })
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