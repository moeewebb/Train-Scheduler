 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB7-qnvb_1D81O8YpYEYNrvdnMrnlexS5I",
    authDomain: "train-scheduler-2c2ca.firebaseapp.com",
    databaseURL: "https://train-scheduler-2c2ca.firebaseio.com",
    projectId: "train-scheduler-2c2ca",
    storageBucket: "",
    messagingSenderId: "880467042988"
  };
  firebase.initializeApp(config);
  
  // FUNCTIONS + EVENTS

  var database = firebase.database();
  var tName = "";
  var tDest = "";
  var fTrain = "";
  var freq = "";  
  
  // On Click of Button
  $("#submitTrain").on("click", function() {

    event.preventDefault();
    
    tName = $("#trainName").val().trim();
    tDest = $("#destination").val().trim();
    fTrain = $("#firstTime").val().trim();
    freq = $("#frequency").val().trim();
    
    database.ref().push({
      trainName: tName,
      destination: tDest,
      frequency: freq,
      firstTrain: fTrain
    });
    clearB();

    console.log(tName + " " + tDest + " " + fTrain + " " + freq)

  });
  
  function clearB(){
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTime").val("");
  $("#frequency").val("");
  };

  database.ref().on("child_added", function(snapshot){

    // store the snapshot value
    var sv = snapshot.val();
    console.log("NEW TRAIN ENTRY: " + sv.trainName + "----------")    
    // First Time (pushed back 1 year to make sure it comes before current time)
    var fTrainConverted = moment(sv.firstTrain, "HH:mm").subtract(1, "years");
    console.log("first time: " + fTrainConverted);

    // Current Time stored with moment.js
    var timeNow = moment();
    console.log("Current Time: " + moment().format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(fTrainConverted), "minutes");
    console.log("Difference Now-fTrain: " + diffTime);

    // Time apart Remainder
    var tRemainder = diffTime % sv.frequency;
    console.log("remdr: " + tRemainder);

    // Minute Until Train
    var nextTrainN = sv.frequency - tRemainder;
    console.log("Next Train in: " + nextTrainN);
    
    // Next Train
    var nextTrainTime = moment().add(nextTrainN, "minutes");
    console.log("Arr. Time: " + moment(nextTrainTime).format("HH:mm"));

    $("tbody").append("<tr><td>" + sv.trainName + "</td><td>" + sv.destination + "</td><td>" + sv.frequency + "</td><td>" + moment(nextTrainTime).format("HH:mm") + "</td><td>" + nextTrainN + "</td></tr>");
    
  });