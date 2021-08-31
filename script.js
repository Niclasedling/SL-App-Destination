function creatingElement(element) 
{
    return document.createElement(element);
}

function append(parent, el) 
{
    return parent.appendChild(el);
}
function getInput(input){
    document.getElementById("numb").innerHTML = '';
    document.getElementById("text").innerHTML = '';
    document.getElementById("min").innerHTML = '';
    if (input.keyCode === 13) {
        let destination = document.getElementById("searchinput").value;
        input.preventDefault();
        getID(destination);
    }
}


function getID(destination)
{
    const url = `https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/typeahead.json?key=50f2bd202a09473b93f699dbe808b668&searchstring=${destination}&stationsonly=true`;

    fetch(url)

        .then((resp) => resp.json())
        .then(function (data) {
            let id = data.ResponseData[0].SiteId;
            
            document.getElementById("headmain").innerHTML = data.ResponseData[0].Name;

            useData(id);
        })
        .catch(function (error) {
            console.log(error);
        })
}
function useData(id){
    

    const url = `https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/realtimedeparturesv4.json?key=c27ae9f15506493b92392470334802a7&siteid=${id}&timewindow=10`;
    
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {

            let trains = data.ResponseData.Metros;

            trains.map(function (train) {

                let div = creatingElement('div'),
                    lineNumber = creatingElement('div'),
                    destinationName = creatingElement('div')
                    time = creatingElement('div');

                lineNumber.innerHTML = train.LineNumber;
                destinationName.innerHTML = train.Destination;
                time.innerHTML = train.DisplayTime;

                append(numb, lineNumber);
                append(text, destinationName);
                append(min, time);
                

            })
        })
        .catch(function (error) {
            console.log(error);
        })
}