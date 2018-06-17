// Initialize Firebase
let config = {
    apiKey: "AIzaSyAQnOPKRCvMEYJI4dqP3QbK8TpyHA4M3mo",
    authDomain: "train-scheduler-d5c4a.firebaseapp.com",
    databaseURL: "https://train-scheduler-d5c4a.firebaseio.com",
    projectId: "train-scheduler-d5c4a",
    storageBucket: "train-scheduler-d5c4a.appspot.com",
    messagingSenderId: "757461331585"
  };
  firebase.initializeApp(config);

  let clearInputs = function() {
    $("#train-x").val("");
    $("#city-x").val("");
    $("#first-leaves-x").val("");
    $("#leaves-every-x").val("");
  };

  let newTrain = firebase.database();
$("#add-button-x").on("click", function() {
  if ( document.getElementById('train-x').value === '' || document.getElementById('city-x').value === '' || document.getElementById('first-leaves-x').value === '' || document.getElementById('leaves-every-x').value === '' ) {
        alert("Enter Train Information");
        return false;
  } else {
  
   
    let train = $("#train-x").val().trim();
   
    let city = $("#city-x").val().trim();
    
    let firstLeaves = moment($("#first-leaves-x").val().trim(), "HH:mm").subtract(10, "years").format("X");
    
    let leavesEvery = $("#leaves-every-x").val().trim();
  
    // VARIABLE FOR FIREBASE OBJECT
    // name
    // destination
    // firstTrain
    // frequency
  
    let addTrain = { name: train, destination: city, firstTrain: firstLeaves, frequency: leavesEvery };
  
    newTrain.ref().push(addTrain);
  
    clearInputs();
  
    return false;
      }
  });

  newTrain.ref().on("child_added", function(childSnapshot) {

  
    let nameOfTrain = childSnapshot.val().name;
  
    let nameOfCity = childSnapshot.val().destination;
    
    let trainLeavesFirst = childSnapshot.val().firstTrain;
  
    let trainFrequency = childSnapshot.val().frequency;
     
    let differenceTimes = moment().diff(moment.unix(trainLeavesFirst), "minutes");
    console.log ("difference in time: " + differenceTimes); 
  
       
    let minutesLeft = moment().diff(moment.unix(trainLeavesFirst), "minutes") % trainFrequency;
    console.log ("minutes left: " + minutesLeft); 
  
        
    let totalTime = trainFrequency - minutesLeft;
    console.log ("total time: " + totalTime); 
  
    
    let nextTrainTime = moment().add(totalTime, "m").format("hh:mm A");
   console.log ("arrival time: " + nextTrainTime); 
   
    $("#train-scheduler > tbody").append("<tr> <td>" + nameOfTrain + "</td> <td>" + nameOfCity + "</td> <td>" + trainFrequency + "</td> <td>" + nextTrainTime + "</td> <td>" + totalTime + "</td> </tr>");
  
  });