
/*
​x=r sin(φ)cos(θ)
​y=r sin(φ)sin(θ)
​z=r cos(φ)
*/

  // !! Joystick & Distance global var
  var xJoystick = 0;
  var yJoystick = 0;
  var distanceSensor = 0;

  //absolute position globals
  var xCoordinate = 0;
  var yCoordinate = 0;
  var zCoordinate = 0;

window.onload = function(){

  /*******************************************************************************************************************
  *********************************************** WEB BLUETOOTH ******************************************************
  ********************************************************************************************************************/

  let button = document.getElementById("connect");
  let message = document.getElementById("message");

  if ( 'bluetooth' in navigator === false ) {
      button.style.display = 'none';
      message.innerHTML = 'This browser doesn\'t support the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API" target="_blank">Web Bluetooth API</a> :(';
  }


  //Absolute position 3D coordinate global var
 // var xCoordinate = 0;
//  var yCoordinate = 0; 
//  var zCoordinate = 0;
  var xCoordinate2 = 0;
  var yCoordinate2 = 0; 
  var zCoordinate2 = 0;

  //let accelerometerData, objectTempData, ambientTempData, heartRateData;


  //sensor array sample data
  var sensorDataArray = new Array(32).fill(0); 

  //master session data array of arrays
  var sensorDataSession = [];

  //samples per position for display in ui
//  var sensorSamplesPerPosition = new Array(3).fill(0); 

  //which samples in the session data array are part of a particular sample set
  var sessionSampleSetIndex = [];

  //track number of sets
  var numSets = 0; 

  var getSamplesFlag = 0;

  //do we have a trained NN to apply to live sensor data?
  var haveNNFlag1 = false;
  var trainNNFlag1 = false;
  var activeNNFlag1 = false;

  var haveNNFlag2 = false;
  var trainNNFlag2 = false;
  var activeNNFlag2 = false;

  //load NN exported activation functions and weights
  var loadNNFlag = false;

  //NN scores
  var scoreArray = new Array(12).fill(0);

	var initialised = false;
	var timeout = null;

  button.onclick = function(e){
      var sensorController = new ControllerWebBluetooth("ThermoV2");
      sensorController.connect();

      sensorController.onStateChange(function(state){
      //console.log("app.js state change");

   /*   accelerometerData = state.accelerometer;
      objectTempData = state.objectTemp;
      ambientTempData = state.ambientTemp;
      heartRateData = state.heartRate; */


      //if data sample collection has been flagged
      sensorDataArray = new Array(30).fill(0); 
      getSensorData();

    /*  if(getSamplesFlag > 0){
          collectData();
      } else */ if (trainNNFlag1 || trainNNFlag2){
          //don't do anything
      } else {
          if(haveNNFlag1 && activeNNFlag1){  //we have a NN and we want to apply to current sensor data
              getNNScore(1);
          }  else if(loadNNFlag){  // !!! NOPE DISABLE FIRST LOADED NN
              getNNScore(1);
          } 
          if(haveNNFlag2 && activeNNFlag2){  //we have a NN and we want to apply to current sensor data
              getNNScore(2);
          } else if(loadNNFlag){
              getNNScore(2);
          }
      }

	//console.log("loadNNFlag in main loop: " + loadNNFlag);

      displayData();
    });

    /******************* DATA COLLECTION SPEED *********************/
    setInterval(function(){ 
   		if(getSamplesFlag > 0){
          	collectData();
      	}
    }, 200);

  }

  

  function displayData(){

    if(state.objectTemp[0] /* && state.pitch */){ //if we have both halves of the data sample
      var objectTempElement1 = document.getElementsByClassName('object-temp-1-data')[0];
      objectTempElement1.innerHTML = state.objectTemp[0].toFixed(1);

      var objectTempElement2 = document.getElementsByClassName('object-temp-2-data')[0];
      objectTempElement2.innerHTML = state.objectTemp[1].toFixed(1);

      var objectTempElement3 = document.getElementsByClassName('object-temp-3-data')[0];
      objectTempElement3.innerHTML = state.objectTemp[2].toFixed(1);

      var objectTempElement4 = document.getElementsByClassName('object-temp-4-data')[0];
      objectTempElement4.innerHTML = state.objectTemp[3].toFixed(1);

      var objectTempElement5 = document.getElementsByClassName('object-temp-5-data')[0];
      objectTempElement5.innerHTML = state.objectTemp[4].toFixed(1);

      var objectTempElement6 = document.getElementsByClassName('object-temp-6-data')[0];
      objectTempElement6.innerHTML = state.objectTemp[5].toFixed(1);

      var objectTempElement7 = document.getElementsByClassName('object-temp-7-data')[0];
      objectTempElement7.innerHTML = state.objectTemp[6].toFixed(1);

      var objectTempElement8 = document.getElementsByClassName('object-temp-8-data')[0];
      objectTempElement8.innerHTML = state.objectTemp[7].toFixed(1);

      var objectTempElement9 = document.getElementsByClassName('object-temp-9-data')[0];
      objectTempElement9.innerHTML = state.objectTemp[8].toFixed(1);

      var objectTempElement10 = document.getElementsByClassName('object-temp-10-data')[0];
      objectTempElement10.innerHTML = state.objectTemp[9].toFixed(1);

      var objectTempElement11 = document.getElementsByClassName('object-temp-11-data')[0];
      objectTempElement11.innerHTML = state.objectTemp[10].toFixed(1);

      var objectTempElement12 = document.getElementsByClassName('object-temp-12-data')[0];
      objectTempElement12.innerHTML = state.objectTemp[11].toFixed(1);

      var objectTempElement13 = document.getElementsByClassName('object-temp-13-data')[0];
      objectTempElement13.innerHTML = state.objectTemp[12].toFixed(1);

      var objectTempElement14 = document.getElementsByClassName('object-temp-14-data')[0];
      objectTempElement14.innerHTML = state.objectTemp[13].toFixed(1);

      var objectTempElement15 = document.getElementsByClassName('object-temp-15-data')[0];
      objectTempElement15.innerHTML = state.objectTemp[14].toFixed(1);

      var objectTempElement16 = document.getElementsByClassName('object-temp-16-data')[0];
      objectTempElement16.innerHTML = state.objectTemp[15].toFixed(1);

      var objectTempElement17 = document.getElementsByClassName('object-temp-17-data')[0];
      objectTempElement17.innerHTML = state.objectTemp[16].toFixed(1);

      var objectTempElement18 = document.getElementsByClassName('object-temp-18-data')[0];
      objectTempElement18.innerHTML = state.objectTemp[17].toFixed(1);

      var objectTempElement19 = document.getElementsByClassName('object-temp-19-data')[0];
      objectTempElement19.innerHTML = state.objectTemp[18].toFixed(1);

      var objectTempElement20 = document.getElementsByClassName('object-temp-20-data')[0];
      objectTempElement20.innerHTML = state.objectTemp[19].toFixed(1);

      var objectTempElement21 = document.getElementsByClassName('object-temp-21-data')[0];
      objectTempElement21.innerHTML = state.objectTemp[20].toFixed(1);

      var objectTempElement22 = document.getElementsByClassName('object-temp-22-data')[0];
      objectTempElement22.innerHTML = state.objectTemp[21].toFixed(1);
    }

    if(state.pitch){
      var pitchElement = document.getElementsByClassName('accelerometer-pitch-data')[0];
      pitchElement.innerHTML = state.pitch.toFixed(1);

      var rollElement = document.getElementsByClassName('accelerometer-roll-data')[0];
      rollElement.innerHTML = state.roll.toFixed(1);  
    }

    if(state.distance1){
      var distance1Element = document.getElementsByClassName('distance-1-data')[0];
      distance1Element.innerHTML = state.distance1.toFixed(1);

      var distance2Element = document.getElementsByClassName('distance-2-data')[0];
      distance2Element.innerHTML = state.distance2.toFixed(1);

      var distance3Element = document.getElementsByClassName('distance-3-data')[0];
      distance3Element.innerHTML = state.distance3.toFixed(1);
    }

    if(state.ambientTemp){
        var ambientTempAverageElement = document.getElementsByClassName('ambient-temp-average-data')[0];
        ambientTempAverageElement.innerHTML = state.ambientTemp;
    }

    if(state.battery){
        var batteryElement = document.getElementsByClassName('battery-data')[0];
        batteryElement.innerHTML = state.battery;
    }
    
    if(state.apds9960){
        var apds9960Element = document.getElementsByClassName('apds9960-data')[0];
        apds9960Element.innerHTML = state.apds9960;
    }


  }

  function getSensorData(){

    if(state.objectTemp){
	    sensorDataArray[0] = state.objectTemp[0].toFixed(1);
	    sensorDataArray[1] = state.objectTemp[1].toFixed(1); 
	    sensorDataArray[2] = state.objectTemp[2].toFixed(1);
	    sensorDataArray[3] = state.objectTemp[3].toFixed(1); 
	    sensorDataArray[4] = state.objectTemp[4].toFixed(1);
	    sensorDataArray[5] = state.objectTemp[5].toFixed(1);
	    sensorDataArray[6] = state.objectTemp[6].toFixed(1);
	    sensorDataArray[7] = state.objectTemp[7].toFixed(1); 
	    sensorDataArray[8] = state.objectTemp[8].toFixed(1);
	    sensorDataArray[9] = state.objectTemp[9].toFixed(1);
	    sensorDataArray[10] = state.objectTemp[10].toFixed(1);  
	    sensorDataArray[11] = state.objectTemp[11].toFixed(1);
	    sensorDataArray[12] = state.objectTemp[12].toFixed(1); 
	    sensorDataArray[13] = state.objectTemp[13].toFixed(1); 
	    sensorDataArray[14] = state.objectTemp[14].toFixed(1);
      sensorDataArray[15] = state.objectTemp[15].toFixed(1);
      sensorDataArray[16] = state.objectTemp[16].toFixed(1);
      sensorDataArray[17] = state.objectTemp[17].toFixed(1);
      sensorDataArray[18] = state.objectTemp[18].toFixed(1);
      sensorDataArray[19] = state.objectTemp[19].toFixed(1);
      sensorDataArray[20] = state.objectTemp[20].toFixed(1);
      sensorDataArray[21] = state.objectTemp[21].toFixed(1);
    }

    if(state.distance1){
      sensorDataArray[22] = state.distance1.toFixed(1);
      sensorDataArray[23] = state.distance2.toFixed(1);
      sensorDataArray[24] = state.distance3.toFixed(1);

    }

    if(state.pitch){
      sensorDataArray[25] = state.pitch.toFixed(1);
      sensorDataArray[26] = state.roll.toFixed(1); 
    }

    if(state.ambientTemp){
      	sensorDataArray[27] = state.ambientTemp.toFixed(1);
    } 

  }

  /*******************************************************************************************************************
  ********************************** COLLECT, PRINT, LOAD BUTTON ACTIONS *********************************************
  ********************************************************************************************************************/

  /*************** COLLECT SAMPLE - SONSOR AND MODEL DATA - STORE IN GSHEET AND ADD TO NN TRAINING OBJECT *****************/
  $('#collect').click(function() {
      console.log("collect button"); 
      //how many samples for this set?
      //this flag is applied in the bluetooth data notification function
      getSamplesFlag = $('input.sample-size').val();
      console.log("Collect btn #samples flag: " + getSamplesFlag);
      
      numSets = numSets + 1;
  }); 

  //print sensor data to browser at bottom of app screen
  $('#print-btn').click(function() {
      console.log("print button"); 

      $("#dump-print").html( JSON.stringify(sensorDataSession) );
      console.log("SENSOR SESSIONS DATA: " + sensorDataSession);
  }); 

  //load data from js file (JSON or JS object) into sensor session data
  $('#load-btn').click(function() {
      console.log("load button"); 
      sensorDataSession = exportedSensorData;

  }); 

  function collectData(){

      var collectedDataArray =  new Array(21).fill(0);  //18 device + 3 joystick jig
      collectedDataArray = sensorDataArray;


   /************* ADD JOYSTICK JIG DATA TO END *********************/
      collectedDataArray[28] = xJoystick.toFixed(4);
      collectedDataArray[29] = yJoystick.toFixed(4);
      collectedDataArray[30] = distanceSensor.toFixed(4);

      console.log("web bluetooth sensor data:");

      console.dir(collectedDataArray);

      //add sample to set
      sensorDataSession.push(collectedDataArray);

      sessionSampleSetIndex.push(numSets);

      console.log("Set Index: "); 
      console.dir(sessionSampleSetIndex);

      getSamplesFlag = getSamplesFlag - 1;

      if(getSamplesFlag > 0){
          //console messages
	      var consoleSamples = document.getElementsByClassName('console-samples')[0];
	      consoleSamples.innerHTML = sensorDataSession.length;
	  }

      if(getSamplesFlag == 0){
          //console messages
      //    var consoleSamples = document.getElementsByClassName('console-samples')[0];
      //    consoleSamples.innerHTML = sensorDataSession.length;

          var consoleSamples = document.getElementsByClassName('console-sets')[0];
          consoleSamples.innerHTML = numSets;
      }

  }


  /*******************************************************************************************************************
  *********************************************** NEURAL NETWORK *****************************************************
  ********************************************************************************************************************/
    /**
   * Attach synaptic neural net components to app object
   */
   // ************** NEURAL NET #1
  var Neuron = synaptic.Neuron;
  var Layer = synaptic.Layer;
  var Network = synaptic.Network;
  var Trainer = synaptic.Trainer;
  var Architect = synaptic.Architect;
  //var neuralNet = new Architect.LSTM(19, 75, 75);
  var neuralNet = new Architect.LSTM(25, 7, 7, 12);
  var trainer = new Trainer(neuralNet);
  var trainingData;

  $('#train-btn').click(function() {
      console.log("train button"); 
      trainNNFlag1 = true;
      trainNN(1);
  });

  $('#activate-btn').click(function() {
      console.log("activate button"); 
      activeNNFlag1 = true;
      $('#activate-btn').toggleClass("activatedNN");

      //if loaded NN, turn off
      if(loadNNFlag){
          loadNNFlag = false;
          $('#load-nn-btn').toggleClass("activatedNN");
      }
  });

    // ************* NEURAL NET #2
  var Neuron2 = synaptic.Neuron;
  var Layer2 = synaptic.Layer;
  var Network2 = synaptic.Network;
  var Trainer2 = synaptic.Trainer;
  var Architect2 = synaptic.Architect;
  //var neuralNet = new Architect.LSTM(19, 75, 75);
  var neuralNet2 = new Architect2.LSTM(25, 12, 12, 12);
  var trainer2 = new Trainer2(neuralNet2);
  var trainingData2;

  $('#train2-btn').click(function() {
      console.log("train button 2"); 
      trainNNFlag2 = true;
      trainNN(2);
  });

  $('#activate2-btn').click(function() {
      console.log("activate button"); 
      activeNNFlag2 = true;
      $('#activate2-btn').toggleClass("activatedNN");

      //if leaded NN, turn off
      if(loadNNFlag){
          loadNNFlag = false;
          $('#load-nn-btn').toggleClass("activatedNN");
      }
  });


  // ************* LOAD TWO EXPORTED NEURAL NET ACTIVATION FUNCTIONS AND WEIGHTS
  $('#load-nn-btn').click(function() {
      console.log("load exported NN button"); 
      loadNNFlag = true;
      $('#load-nn-btn').toggleClass("activatedNN");
  });



function getNNScore(selectNN){

	//T2 and T21 are for hand gestures, not position tracking
	//20 object temp reading for NN


  //make sure non of our object temp readings are above our device temp readings
  var modifiedAmbient = sensorDataArray[27] + 15;

  scoreArray = new Array(25).fill(0);

    if(selectNN == 1){
        var feedArray = new Array(25).fill(0);
        //object temp
        feedArray[0] = (sensorDataArray[0] - 70) / (modifiedAmbient - 70);
      //feedArray[1] = sensorDataArray[1] / 101;  //for hand
        feedArray[1] = (sensorDataArray[2] - 70) / (modifiedAmbient - 70);
        feedArray[2] = (sensorDataArray[3] - 70) / (modifiedAmbient - 70);
        feedArray[3] = (sensorDataArray[4] - 70) / (modifiedAmbient - 70);
        feedArray[4] = (sensorDataArray[5] - 70) / (modifiedAmbient - 70);
        feedArray[5] = (sensorDataArray[6] - 70) / (modifiedAmbient - 70);
        feedArray[6] = (sensorDataArray[7] - 70) / (modifiedAmbient - 70);
        feedArray[7] = (sensorDataArray[8] - 70) / (modifiedAmbient - 70);
        feedArray[8] = (sensorDataArray[9] - 70) / (modifiedAmbient - 70);
        feedArray[9] = (sensorDataArray[10] - 70) / (modifiedAmbient - 70);
        feedArray[10] = (sensorDataArray[11] - 70) / (modifiedAmbient - 70);
        feedArray[11] = (sensorDataArray[12] - 70) / (modifiedAmbient - 70);
        feedArray[12] = (sensorDataArray[13] - 70) / (modifiedAmbient - 70);
        feedArray[13] = (sensorDataArray[14] - 70) / (modifiedAmbient - 70);
        feedArray[14] = (sensorDataArray[15] - 70) / (modifiedAmbient - 70);
        feedArray[15] = (sensorDataArray[16] - 70) / (modifiedAmbient - 70);
        feedArray[16] = (sensorDataArray[17] - 70) / (modifiedAmbient - 70);
        feedArray[17] = (sensorDataArray[18] - 70) / (modifiedAmbient - 70);
        feedArray[18] = (sensorDataArray[19] - 70) / (modifiedAmbient - 70);
      //  feedArray[19] = (sensorDataArray[20] - 70) / (101 - 70);  //for hand
        feedArray[19] = (sensorDataArray[21] - 70) / (modifiedAmbient - 70);

        //distance
        feedArray[20] = sensorDataArray[22] / 1020;
        feedArray[21] = sensorDataArray[23] / 1020;
        feedArray[22] = sensorDataArray[24] / 1020;

        //pitch & roll
        feedArray[23] = sensorDataArray[25] / 360;
        feedArray[24] = sensorDataArray[26] / 360;

        //average ambient temp
     //   feedArray[25] = (sensorDataArray[27] - 70) / (101 - 70);

         
        // use trained NN or loaded NN
        if(haveNNFlag1 && activeNNFlag1){ 
            scoreArray = neuralNet.activate(feedArray);
        } else if(loadNNFlag){
            scoreArray = neuralNetwork1(feedArray);
        }
        console.log("NN1 FEED ARRAY: " + feedArray);
        console.log("NN1 SCORE ARRAY: " + scoreArray);

    } else if(selectNN == 2){
        var feedArray = new Array(25).fill(0);
        //object temp
        feedArray[0] = (sensorDataArray[0] - 70) / (modifiedAmbient - 70);
      //feedArray[1] = sensorDataArray[1] / 101;  //for hand
        feedArray[1] = (sensorDataArray[2] - 70) / (modifiedAmbient - 70);
        feedArray[2] = (sensorDataArray[3] - 70) / (modifiedAmbient - 70);
        feedArray[3] = (sensorDataArray[4] - 70) / (modifiedAmbient - 70);
        feedArray[4] = (sensorDataArray[5] - 70) / (modifiedAmbient - 70);
        feedArray[5] = (sensorDataArray[6] - 70) / (modifiedAmbient - 70);
        feedArray[6] = (sensorDataArray[7] - 70) / (modifiedAmbient - 70);
        feedArray[7] = (sensorDataArray[8] - 70) / (modifiedAmbient - 70);
        feedArray[8] = (sensorDataArray[9] - 70) / (modifiedAmbient - 70);
        feedArray[9] = (sensorDataArray[10] - 70) / (modifiedAmbient - 70);
        feedArray[10] = (sensorDataArray[11] - 70) / (modifiedAmbient - 70);
        feedArray[11] = (sensorDataArray[12] - 70) / (modifiedAmbient - 70);
        feedArray[12] = (sensorDataArray[13] - 70) / (modifiedAmbient - 70);
        feedArray[13] = (sensorDataArray[14] - 70) / (modifiedAmbient - 70);
        feedArray[14] = (sensorDataArray[15] - 70) / (modifiedAmbient - 70);
        feedArray[15] = (sensorDataArray[16] - 70) / (modifiedAmbient - 70);
        feedArray[16] = (sensorDataArray[17] - 70) / (modifiedAmbient - 70);
        feedArray[17] = (sensorDataArray[18] - 70) / (modifiedAmbient - 70);
        feedArray[18] = (sensorDataArray[19] - 70) / (modifiedAmbient - 70);
      //  feedArray[19] = (sensorDataArray[20] - 70) / (101 - 70);  //for hand
        feedArray[19] = (sensorDataArray[21] - 70) / (modifiedAmbient - 70);

        //distance
        feedArray[20] = sensorDataArray[22] / 1020;
        feedArray[21] = sensorDataArray[23] / 1020;
        feedArray[22] = sensorDataArray[24] / 1020;

        //pitch & roll
        feedArray[23] = sensorDataArray[25] / 360;
        feedArray[24] = sensorDataArray[26] / 360;

        //average ambient temp
     //   feedArray[25] = (sensorDataArray[27] - 70) / (101 - 70);

        if(haveNNFlag2 && activeNNFlag2){ 
            scoreArray = neuralNet2.activate(feedArray);
        } else if(loadNNFlag){
            scoreArray = neuralNetwork2(feedArray);
        }

        console.log("NN2 FEED ARRAY: " + feedArray);
        console.log("NN2 SCORE ARRAY: " + scoreArray);
    } 

    getCoordinates(scoreArray, selectNN);
    
}

function getCoordinates(scoreArray, selectNN){

    var tempScoreArray = new Array(3).fill(0);  //for recombined x/y/z
   // tempScoreArray = scoreArray;

   // X axis
    tempScoreArray[0] = ( scoreArray[0] + scoreArray[1] + scoreArray[2] + scoreArray[3] + scoreArray[4] + scoreArray[5] + scoreArray[6] + scoreArray[7]) / 8;

    // Y axis
    tempScoreArray[1] = ( scoreArray[8] + scoreArray[9] ) / 2 ;

    // Z axis
    tempScoreArray[2] = ( scoreArray[10] + scoreArray[11] ) / 2;

    console.log("RECOMBINED SCORES: " + tempScoreArray);


    //ADJUST VALUES FOR OUTPUT RANGE
    //X axis
    if(tempScoreArray[0] < 0.60){ tempScoreArray[0] = 0.60; }
    if(tempScoreArray[0] > 0.80){ tempScoreArray[0] = 0.80; }
 //   if(xCoordinate > 30) xCoordinate = 30;
    tempScoreArray[0] = (tempScoreArray[0] - 0.60) * (1 / (0.80 - 0.60) ) ; 

    // Z axis
    if(tempScoreArray[2] < 0.5){ tempScoreArray[2] = 0.5; }
    if(tempScoreArray[2] > 0.7){ tempScoreArray[2] = 0.7; }

    tempScoreArray[2] = (tempScoreArray[2] - 0.5) * (1 / (0.7 - 0.5) );

    console.log("ADJUSTED SCORES: " + tempScoreArray);

    



  	//interpret directly as cartesian coordinates
  	xCoordinate = ( ( 1 - tempScoreArray[0] ) * 100   + xCoordinate*2) / 3;
    yCoordinate = ( ( 1 - tempScoreArray[1] ) * 100   + yCoordinate*2) / 3;
    zCoordinate = ( ( 1 - tempScoreArray[2] ) * 100   + zCoordinate*2) / 3;


    console.log(" x/y/z: " + xCoordinate + "  " + yCoordinate + "  " + zCoordinate);



    //convert from spherical coordinates to cartesian coordinates
 /*   var theta = scoreArray[0] * 100;
    var phi = 100 - ( scoreArray[1] * 100 );
    var radius = scoreArray[2] * 100;

    var xCoordinate2 = radius * Math.sin(theta) * Math.cos(phi);
    var yCoordinate2 = radius * Math.sin(theta) * Math.sin(phi);
    var zCoordinate2 = radius * Math.cos(theta); */
    


      if(selectNN == 1){
          $("#coordinates1").html("X1A: <p>" + xCoordinate.toFixed(1) + "</p>   Y1A: <p>" + yCoordinate.toFixed(1) + "</p>   Z1A: <p>" + zCoordinate.toFixed(1) + "</p>");
       //   $("#coordinates2").html("X1B: <p>" + xCoordinate2.toFixed(1) + "</p>   Y1B: <p>" + yCoordinate2.toFixed(1) + "</p>   Z1B: <p>" + zCoordinate2.toFixed(1) + "</p>");
          $("#absolute-position1").css({"top": (yCoordinate) + "%", "left": xCoordinate + "%", "font-size": ((zCoordinate) / 5 + 5) + "rem"});
       //   $("#absolute-position2").css({"top": (80 - yCoordinate2) + "%", "left": xCoordinate2 + "%", "font-size": ((100 - zCoordinate2) / 6 + 5) + "rem"});
      } else if(selectNN == 2) {
          $("#coordinates3").html("X2A: <p>" + xCoordinate.toFixed(1) + "</p>   Y2A: <p>" + yCoordinate.toFixed(1) + "</p>   Z2A: <p>" + zCoordinate.toFixed(1) + "</p>");
      //    $("#coordinates4").html("X2B: <p>" + xCoordinate2.toFixed(1) + "</p>   Y2B: <p>" + yCoordinate2.toFixed(1) + "</p>   Z2B: <p>" + zCoordinate2.toFixed(1) + "</p>");
          $("#absolute-position3").css({"top": (yCoordinate) + "%", "left": xCoordinate + "%", "font-size": ((zCoordinate) / 5 + 5) + "rem"});
      //    $("#absolute-position4").css({"top": (80 - yCoordinate2) + "%", "left": xCoordinate2 + "%", "font-size": ((100 - zCoordinate2) / 6 + 5) + "rem"});
      }

    //  console.log("NN# " + selectNN);
  }

  $('#export-btn').click(function() {
      console.log("export1 NN button"); 
      //clear everything but key values from stored NN
      neuralNet.clear();

      //export optimized weights and activation function
      var standalone = neuralNet.standalone();

      //convert to string for parsing
      standalone = standalone.toString();

      console.log(standalone);
  });

  $('#export2-btn').click(function() {
      console.log("export2 NN button"); 
      //clear everything but key values from stored NN
      neuralNet2.clear();

      //export optimized weights and activation function
      var standalone = neuralNet2.standalone();

      //convert to string for parsing
      standalone = standalone.toString();

      console.log(standalone);
  });


/**************************** TRAIN NN ******************************/
function trainNN(selectNN){

    var processedDataSession = sensorDataSession;
    var trainingData = [];


    var countRealTraining = 0;

    for(var i=0; i<processedDataSession.length; i++){

        var currentSample = processedDataSession[i];

// Spread joystick data across multiple output nodes
        var outputArray = new Array(12).fill(0);     // 1-6 --> X   7-8 --> Y  9-10 --> Z

        // X axis
        if(currentSample[28] < 0.125){
          outputArray[0] = currentSample[28] * 8;
          outputArray[1] = 0;
          outputArray[2] = 0;
          outputArray[3] = 0;
          outputArray[4] = 0;
          outputArray[5] = 0;
          outputArray[6] = 0;
          outputArray[7] = 0;
        } else if(currentSample[28] >= 0.125 && currentSample[28] < 0.25){
          outputArray[0] = 1;
          outputArray[1] = (currentSample[28] - 0.125) * 8;
          outputArray[2] = 0;
          outputArray[3] = 0;
          outputArray[4] = 0;
          outputArray[5] = 0;
          outputArray[6] = 0;
          outputArray[7] = 0;
        } else if(currentSample[28] >= 0.25 && currentSample[28] < 0.375){
          outputArray[0] = 1;
          outputArray[1] = 1;
          outputArray[2] = (currentSample[28] - 0.25) * 8;
          outputArray[3] = 0;
          outputArray[4] = 0;
          outputArray[5] = 0;
          outputArray[6] = 0;
          outputArray[7] = 0;
        } else if(currentSample[28] >= 0.375 && currentSample[28] < 0.5){
          outputArray[0] = 1;
          outputArray[1] = 1;
          outputArray[2] = 1;
          outputArray[3] = (currentSample[28] - 0.375) * 8;
          outputArray[4] = 0;
          outputArray[5] = 0;
          outputArray[6] = 0;
          outputArray[7] = 0;
        } else if(currentSample[28] >= 0.5 && currentSample[28] < 0.625){
          outputArray[0] = 1;
          outputArray[1] = 1;
          outputArray[2] = 1;
          outputArray[3] = 1;
          outputArray[4] = (currentSample[28] - 0.5) * 8;
          outputArray[5] = 0;
          outputArray[6] = 0;
          outputArray[7] = 0;
        } else if(currentSample[28] >= 0.625 && currentSample[28] < 0.75){
          outputArray[0] = 1;
          outputArray[1] = 1;
          outputArray[2] = 1;
          outputArray[3] = 1;
          outputArray[4] = 1;
          outputArray[5] = (currentSample[28] - 0.625) * 8;
          outputArray[6] = 0;
          outputArray[7] = 0;
        } else if(currentSample[28] >= 0.75 && currentSample[28] < 0.875){
          outputArray[0] = 1;
          outputArray[1] = 1;
          outputArray[2] = 1;
          outputArray[3] = 1;
          outputArray[4] = 1;
          outputArray[5] = 1;
          outputArray[6] = (currentSample[28] - 0.75) * 8;
          outputArray[7] = 0;
        } else {
          outputArray[0] = 1;
          outputArray[1] = 1;
          outputArray[2] = 1;
          outputArray[3] = 1;
          outputArray[4] = 1;
          outputArray[5] = 1;
          outputArray[6] = 1;
          outputArray[7] = (currentSample[28] - 0.875) * 8;
        } 

        // Y axis
        if(currentSample[29] < 0.5){
        	outputArray[8] = currentSample[29] * 2;
        	outputArray[9] = 0;
        } else {
        	outputArray[8] = 1;
        	outputArray[9] = (currentSample[29] - 0.5) * 2;
        }

        // Z axis
        if(currentSample[30] < 0.5){
        	outputArray[10] = currentSample[30] * 2;
        	outputArray[11] = 0;
        } else {
        	outputArray[10] = 1;
        	outputArray[11] = (currentSample[30] - 0.5) * 2;
        }

        //make sure non of our object temp readings are above our device temp readings
        var modifiedAmbient = currentSample[27] + 15;

         if(selectNN == 1){

            var inputArray = new Array(25).fill(0);
        	//object temp
            inputArray[0] = (currentSample[0] - 70) / (modifiedAmbient - 70);
      //      inputArray[1] = sensorDataArray[1] / 101;  //for hand
            inputArray[1] = (currentSample[2] - 70) / (modifiedAmbient - 70);
            inputArray[2] = (currentSample[3] - 70) / (modifiedAmbient - 70);
            inputArray[3] = (currentSample[4] - 70) / (modifiedAmbient - 70);
            inputArray[4] = (currentSample[5] - 70) / (modifiedAmbient - 70);
            inputArray[5] = (currentSample[6] - 70) / (modifiedAmbient - 70);
            inputArray[6] = (currentSample[7] - 70) / (modifiedAmbient - 70);
            inputArray[7] = (currentSample[8] - 70) / (modifiedAmbient - 70);
            inputArray[8] = (currentSample[9] - 70) / (modifiedAmbient - 70);
            inputArray[9] = (currentSample[10] - 70) / (modifiedAmbient - 70);
            inputArray[10] = (currentSample[11] - 70) / (modifiedAmbient - 70);
            inputArray[11] = (currentSample[12] - 70) / (modifiedAmbient - 70);
            inputArray[12] = (currentSample[13] - 70) / (modifiedAmbient - 70);
            inputArray[13] = (currentSample[14] - 70) / (modifiedAmbient - 70);
            inputArray[14] = (currentSample[15] - 70) / (modifiedAmbient - 70);
            inputArray[15] = (currentSample[16] - 70) / (modifiedAmbient - 70);
            inputArray[16] = (currentSample[17] - 70) / (modifiedAmbient - 70);
            inputArray[17] = (currentSample[18] - 70) / (modifiedAmbient - 70);
            inputArray[18] = (currentSample[19] - 70) / (modifiedAmbient - 70);
          //  inputArray[19] = (sensorDataArray[20] - 70) / (101 - 70);  //for hand
            inputArray[19] = (currentSample[21] - 70) / (modifiedAmbient - 70);

            //distance
            inputArray[20] = (currentSample[22] / 1020);
            inputArray[21] = (currentSample[23] / 1020);
            inputArray[22] = (currentSample[24] / 1020);

            //pitch & roll
            inputArray[23] = (currentSample[25] / 360);
            inputArray[24] = (currentSample[26] / 360);

            //average ambient temp
         //   inputArray[25] = ( (currentSample[27] - 70) / (101 - 70) );

        } else if(selectNN == 2){

            var inputArray = new Array(25).fill(0);
          //object temp
            inputArray[0] = (currentSample[0] - 70) / (modifiedAmbient - 70);
      //      inputArray[1] = sensorDataArray[1] / 101;  //for hand
            inputArray[1] = (currentSample[2] - 70) / (modifiedAmbient - 70);
            inputArray[2] = (currentSample[3] - 70) / (modifiedAmbient - 70);
            inputArray[3] = (currentSample[4] - 70) / (modifiedAmbient - 70);
            inputArray[4] = (currentSample[5] - 70) / (modifiedAmbient - 70);
            inputArray[5] = (currentSample[6] - 70) / (modifiedAmbient - 70);
            inputArray[6] = (currentSample[7] - 70) / (modifiedAmbient - 70);
            inputArray[7] = (currentSample[8] - 70) / (modifiedAmbient - 70);
            inputArray[8] = (currentSample[9] - 70) / (modifiedAmbient - 70);
            inputArray[9] = (currentSample[10] - 70) / (modifiedAmbient - 70);
            inputArray[10] = (currentSample[11] - 70) / (modifiedAmbient - 70);
            inputArray[11] = (currentSample[12] - 70) / (modifiedAmbient - 70);
            inputArray[12] = (currentSample[13] - 70) / (modifiedAmbient - 70);
            inputArray[13] = (currentSample[14] - 70) / (modifiedAmbient - 70);
            inputArray[14] = (currentSample[15] - 70) / (modifiedAmbient - 70);
            inputArray[15] = (currentSample[16] - 70) / (modifiedAmbient - 70);
            inputArray[16] = (currentSample[17] - 70) / (modifiedAmbient - 70);
            inputArray[17] = (currentSample[18] - 70) / (modifiedAmbient - 70);
            inputArray[18] = (currentSample[19] - 70) / (modifiedAmbient - 70);
          //  inputArray[19] = (sensorDataArray[20] - 70) / (101 - 70);  //for hand
            inputArray[19] = (currentSample[21] - 70) / (modifiedAmbient - 70);

            //distance
            inputArray[20] = (currentSample[22] / 1020);
            inputArray[21] = (currentSample[23] / 1020);
            inputArray[22] = (currentSample[24] / 1020);

            //pitch & roll
            inputArray[23] = (currentSample[25] / 360);
            inputArray[24] = (currentSample[26] / 360);

            //average ambient temp
        //    inputArray[25] = ( (currentSample[27] - 70) / (101 - 70) );
        }

        //is sample at maximum/minimum of joystick range
        var notEdge = true;
        if(outputArray[0] < 0.05 || outputArray[7] > 0.95 || outputArray[8] < 0.05 || outputArray[9] > 0.95){ notEdge = false; }

        //randomly filter edge data
        var randFilter = Math.random();

        //filter 50% of joystick edge data
        if(randFilter > 0.5 || notEdge){

          trainingData.push({
              input:  inputArray, 
              output: outputArray
          });

          console.log(currentSample + " TRAIN INPUT: " + inputArray);
          console.log(currentSample + " TRAIN OUTPUT: " + outputArray);

        } else {
          console.log("Trn Element " + i + "filtered - output: " + outputArray);
        }


    }

    if(selectNN == 1){
      console.log("TRAINING ON selectNN1 - data length: " + trainingData.length);

        trainer.train(trainingData, {
            rate: 0.05,
         //   iterations: 15000,
            iterations: 200,
            error: 0.04,
            shuffle: true,
         //   log: 1000,
            log: 5,
            cost: Trainer.cost.CROSS_ENTROPY
        });

        //we have a trained NN to use
        haveNNFlag1 = true;
        trainNNFlag1 = false;
        $('#activate-btn').addClass("haveNN");
        $('#export-btn').addClass("haveNN");

    } else if(selectNN == 2){
      console.log("TRAINING ON selectNN2");

          trainer2.train(trainingData, {
            rate: 0.05,
         //   iterations: 15000,
            iterations: 200,
            error: 0.04,
            shuffle: true,
         //   log: 1000,
            log: 5,
            cost: Trainer2.cost.CROSS_ENTROPY
        });

        //we have a trained NN to use
        haveNNFlag2 = true;
        trainNNFlag2 = false;
        $('#activate2-btn').addClass("haveNN");
        $('#export2-btn').addClass("haveNN");
    }

}


//end window on load
}
