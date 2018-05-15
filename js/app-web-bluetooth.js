
/*CONVERSION FROM SPHERICAL TO CARTESIAN
Conversion Formula

Conversely spherical coordinates may be converted to Cartesian coordinates using the following formulas:

break x/y/z coordinates into 7 output NN from 3 output NN

​​ 
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

  let accelerometerData, objectTempData, ambientTempData, heartRateData;


  //3D model arm position sample data
 // var poseDataArray = []; 
  //sensor array sample data
  //var sensorDataArray = new Array(12).fill(0); 
  var sensorDataArray = new Array(18).fill(0); 

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
    var sensorController = new ControllerWebBluetooth("Thermo");
    sensorController.connect();

    sensorController.onStateChange(function(state){

      accelerometerData = state.accelerometer;
      objectTempData = state.objectTemp;
      ambientTempData = state.ambientTemp;
      heartRateData = state.heartRate;


      //if data sample collection has been flagged
      sensorDataArray = new Array(18).fill(0); 
      getSensorData();
      if(getSamplesFlag > 0){
          collectData();
      } else if (trainNNFlag1 || trainNNFlag2){
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

	console.log("loadNNFlag in main loop: " + loadNNFlag);

      displayData();
    });
  }

  

  function displayData(){

    if(accelerometerData){
      var accelerometerPitchDiv = document.getElementsByClassName('accelerometer-pitch-data')[0];
      accelerometerPitchDiv.innerHTML = accelerometerData.pitch.toFixed(1);

      var accelerometerRollDiv = document.getElementsByClassName('accelerometer-roll-data')[0];
      accelerometerRollDiv.innerHTML = accelerometerData.roll.toFixed(1);
    }

    if(state.objectTemp[0] && state.pitch){ //if we have both halves of the data sample
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

    if(state.ambientTemp){
        var ambientTempAverageElement = document.getElementsByClassName('ambient-temp-average-data')[0];
        ambientTempAverageElement.innerHTML = state.ambientTemp;
    }

  }

  function getSensorData(){

    if(objectTempData){
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
    }
    if(ambientTempData){
      	sensorDataArray[15] = state.ambientTemp.toFixed(1);
    } 
    if(accelerometerData){
      	sensorDataArray[16] = state.pitch.toFixed(1);
	    sensorDataArray[17] = state.roll.toFixed(1); 
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

  //	  sensorDataArray = new Array(18).fill(0); 
   //   getSensorData();

    //  var collectedDataArray =  new Array(19).fill(0);
      var collectedDataArray =  new Array(21).fill(0);  //18 device + 3 joystick jig
      collectedDataArray = sensorDataArray;
    //  var positionNumber = $('#master-pose-input').val() - 1;

      //add pose # to first element of sensor data array
   //   collectedDataArray.unshift( positionNumber );

   //!!!!!!!!!!!!!!!!!!!!!!!!!! ADD JOYSTICK JIG DATA TO END!
   //!!!!!!!!!!!!!!!!!!!!!!!!!! ADD JOYSTICK JIG DATA TO END!
   //!!!!!!!!!!!!!!!!!!!!!!!!!! ADD JOYSTICK JIG DATA TO END!
      collectedDataArray[18] = xJoystick.toFixed(4);
      collectedDataArray[19] = yJoystick.toFixed(4);
      collectedDataArray[20] = distanceSensor.toFixed(4);

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
  var neuralNet = new Architect.LSTM(12, 7, 7, 12);
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
  var neuralNet2 = new Architect2.LSTM(12, 4, 4, 12);
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

  scoreArray = new Array(12).fill(0);

    if(selectNN == 1){
        var feedArray = new Array(12).fill(0);
            feedArray[0] = sensorDataArray[0] / 101;
      //      positionFeedArray[1] = sensorDataArray[1] / 101;
            feedArray[1] = sensorDataArray[2] / 101;
      //      positionFeedArray[3] = sensorDataArray[3] / 101;
            feedArray[2] = sensorDataArray[4] / 101;
            feedArray[3] = sensorDataArray[5] / 101;
            feedArray[4] = sensorDataArray[6] / 101;
      //      positionFeedArray[7] = sensorDataArray[7] / 101;
            feedArray[5] = sensorDataArray[8] / 101;
            feedArray[6] = sensorDataArray[9] / 101;
      //      positionFeedArray[10] = sensorDataArray[10] / 101;
            feedArray[7] = sensorDataArray[11] / 101;
            feedArray[8] = sensorDataArray[12] / 101;
      //      positionFeedArray[13] = sensorDataArray[13] / 101;
            feedArray[9] = sensorDataArray[14] / 101;
            // sensorDataArray[15] is ambient Temp
            feedArray[10] = sensorDataArray[16] / 360;
            feedArray[11] = sensorDataArray[17] / 360;


        // use trained NN or loaded NN
        if(haveNNFlag1 && activeNNFlag1){ 
            scoreArray = neuralNet.activate(feedArray);
        } else if(loadNNFlag){
            scoreArray = neuralNetwork1(feedArray);
        }
        console.log("NN1 FEED ARRAY: " + feedArray);
        console.log("NN1 SCORE ARRAY: " + scoreArray);

    } else if(selectNN == 2){
        var feedArray = new Array(12).fill(0);
            feedArray[0] = sensorDataArray[0] / 101;
      //      positionFeedArray[1] = sensorDataArray[1] / 101;
            feedArray[1] = sensorDataArray[2] / 101;
      //      positionFeedArray[3] = sensorDataArray[3] / 101;
            feedArray[2] = sensorDataArray[4] / 101;
            feedArray[3] = sensorDataArray[5] / 101;
            feedArray[4] = sensorDataArray[6] / 101;
      //      positionFeedArray[7] = sensorDataArray[7] / 101;
            feedArray[5] = sensorDataArray[8] / 101;
            feedArray[6] = sensorDataArray[9] / 101;
      //      positionFeedArray[10] = sensorDataArray[10] / 101;
            feedArray[7] = sensorDataArray[11] / 101;
            feedArray[8] = sensorDataArray[12] / 101;
      //      positionFeedArray[13] = sensorDataArray[13] / 101;
            feedArray[9] = sensorDataArray[14] / 101;
            // sensorDataArray[15] is ambient Temp
            feedArray[10] = sensorDataArray[16] / 360;
            feedArray[11] = sensorDataArray[17] / 360;

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

    /******************* PRE-PROCESSING DATA ************************/
    /******************* PRE-PROCESSING DATA ************************/
    var minMaxAreaSize = processedDataSession.length * 0.01; //sample edge size for average min or max over that area

    console.log("SIZE OF UNPROCESSED SESSION DATA: " + processedDataSession.length);
    console.log("SIZE OF EDGE TO BE TRIMMED FROM DATA: " + minMaxAreaSize);


/*  SKIP TRIM


    var dataMaximums = new Array(3).fill(0);
    var dataMinimums = new Array(3).fill(0);
 //   var minX = findAreaMinimum(processedDataSession, minMaxAreaSize);

    //sort session data to get maximums, minimums and trim from edges
    //from https://stackoverflow.com/questions/2793847/sort-outer-array-based-on-values-in-inner-array-javascript
    for(var index = 18; index < 21; index++){

        console.log("INDEX OF GAMEPAD DATA x/3 CURRENTLY BEING SORTED: " + index);

        //get array of max values
        processedDataSession.sort((function(index){
            return function(a, b){
                return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
            };
        })(index)); //  is the index

        //slice ends off session data to remove max and min edge cases
        processedDataSession = processedDataSession.slice(minMaxAreaSize, processedDataSession.length - minMaxAreaSize);

        //get rid of values that may have come from maxed out sensor range, things that are too close to 0 or 1
        for(var f = 0; f < processedDataSession.length; f++){

            //get rid of values that are too high
            if(processedDataSession[processedDataSession.length-1][index] > 0.99){
                processedDataSession = processedDataSession.slice(0, processedDataSession.length - 1);
            }

            //get rid of values that are too low
            if(processedDataSession[0][index] < 0.01){
                processedDataSession = processedDataSession.slice(1, processedDataSession.length);
            }
        }

        //get max and min from ends of trimmed data, take a little more off incase sensors exceeded max range a bunch of times
        dataMinimums[index - 18] = processedDataSession[0][index];
        dataMaximums[index - 18] = processedDataSession[processedDataSession.length - 1][index];

    }

    //map data to new min and max to span full 0-1 NN normal range
    for(var p = 0; p < processedDataSession.length; p++){

        processedDataSession[p][18] = ( processedDataSession[p][18] - dataMinimums[0] ) * ( 1 / ( dataMaximums[0] - dataMinimums[0] ) );
        processedDataSession[p][19] = ( processedDataSession[p][19] - dataMinimums[1] ) * ( 1 / ( dataMaximums[1] - dataMinimums[1] ) );
        processedDataSession[p][20] = ( processedDataSession[p][20] - dataMinimums[2] ) * ( 1 / ( dataMaximums[2] - dataMinimums[2] ) );

    }

    console.log("MINIMUM VALUES: " + dataMinimums);
    console.log("MAXIMUM VALUES: " + dataMaximums);
    console.log("SIZE OF SORTED, TRIMMED AND MAPPED DATA: " + processedDataSession.length);
    console.log("SORTED, TRIMMED AND MAPPED DATA: " + processedDataSession);

    */


    /******************* END PRE-PROCESSING DATA ********************/
    /******************* END PRE-PROCESSING DATA ********************/


    for(var i=0; i<processedDataSession.length; i++){

        var currentSample = processedDataSession[i];


// HERE IS WHERE WE SPLIT SPLAT SLICE DICE !!!!!!!!!!!!!!!!!!!!!!!!!
// HERE IS WHERE WE SPLIT SPLAT SLICE DICE !!!!!!!!!!!!!!!!!!!!!!!!!
// HERE IS WHERE WE SPLIT SPLAT SLICE DICE !!!!!!!!!!!!!!!!!!!!!!!!!
        var outputArray = new Array(12).fill(0);     // 1-6 --> X   7-8 --> Y  9-10 --> Z

        //!!!  JOYSTICK JIG DATA !!!
     //   outputArray[0] = currentSample[18];
     //   outputArray[1] = currentSample[19];
     //   outputArray[2] = currentSample[20];

        // X axis
   /*     if(currentSample[18] < 0.33333){
        	outputArray[0] = currentSample[18] * 3;
        	outputArray[1] = 0;
        	outputArray[2] = 0;
        } else if(currentSample[18] >= 0.33333 && currentSample[18] < 0.66666){
        	outputArray[0] = 1;
        	outputArray[1] = (currentSample[18] - 0.33333) * 3;
        	outputArray[2] = 0;
        } else {
        	outputArray[0] = 1;
        	outputArray[1] = 1;
        	outputArray[2] = (currentSample[18] - 0.66666) * 3;
        } */

        // X axis
        if(currentSample[18] < 0.125){
          outputArray[0] = currentSample[18] * 8;
          outputArray[1] = 0;
          outputArray[2] = 0;
          outputArray[3] = 0;
          outputArray[4] = 0;
          outputArray[5] = 0;
          outputArray[6] = 0;
          outputArray[7] = 0;
        } else if(currentSample[18] >= 0.125 && currentSample[18] < 0.25){
          outputArray[0] = 1;
          outputArray[1] = (currentSample[18] - 0.125) * 8;
          outputArray[2] = 0;
          outputArray[3] = 0;
          outputArray[4] = 0;
          outputArray[5] = 0;
          outputArray[6] = 0;
          outputArray[7] = 0;
        } else if(currentSample[18] >= 0.25 && currentSample[18] < 0.375){
          outputArray[0] = 1;
          outputArray[1] = 1;
          outputArray[2] = (currentSample[18] - 0.25) * 8;
          outputArray[3] = 0;
          outputArray[4] = 0;
          outputArray[5] = 0;
          outputArray[6] = 0;
          outputArray[7] = 0;
        } else if(currentSample[18] >= 0.375 && currentSample[18] < 0.5){
          outputArray[0] = 1;
          outputArray[1] = 1;
          outputArray[2] = 1;
          outputArray[3] = (currentSample[18] - 0.375) * 8;
          outputArray[4] = 0;
          outputArray[5] = 0;
          outputArray[6] = 0;
          outputArray[7] = 0;
        } else if(currentSample[18] >= 0.5 && currentSample[18] < 0.625){
          outputArray[0] = 1;
          outputArray[1] = 1;
          outputArray[2] = 1;
          outputArray[3] = 1;
          outputArray[4] = (currentSample[18] - 0.5) * 8;
          outputArray[5] = 0;
          outputArray[6] = 0;
          outputArray[7] = 0;
        } else if(currentSample[18] >= 0.625 && currentSample[18] < 0.75){
          outputArray[0] = 1;
          outputArray[1] = 1;
          outputArray[2] = 1;
          outputArray[3] = 1;
          outputArray[4] = 1;
          outputArray[5] = (currentSample[18] - 0.625) * 8;
          outputArray[6] = 0;
          outputArray[7] = 0;
        } else if(currentSample[18] >= 0.75 && currentSample[18] < 0.875){
          outputArray[0] = 1;
          outputArray[1] = 1;
          outputArray[2] = 1;
          outputArray[3] = 1;
          outputArray[4] = 1;
          outputArray[5] = 1;
          outputArray[6] = (currentSample[18] - 0.75) * 8;
          outputArray[7] = 0;
        } else {
          outputArray[0] = 1;
          outputArray[1] = 1;
          outputArray[2] = 1;
          outputArray[3] = 1;
          outputArray[4] = 1;
          outputArray[5] = 1;
          outputArray[6] = 1;
          outputArray[7] = (currentSample[18] - 0.875) * 8;
        } 

        // Y axis
        if(currentSample[19] < 0.5){
        	outputArray[8] = currentSample[19] * 2;
        	outputArray[9] = 0;
        } else {
        	outputArray[8] = 1;
        	outputArray[9] = (currentSample[19] - 0.5) * 2;
        }

        // Z axis
        if(currentSample[20] < 0.5){
        	outputArray[10] = currentSample[20] * 2;
        	outputArray[11] = 0;
        } else {
        	outputArray[10] = 1;
        	outputArray[11] = (currentSample[20] - 0.5) * 2;
        }




         if(selectNN == 1){
            var inputArray = new Array(12).fill(0);
            inputArray[0] = currentSample[0] / 101;
      //      positionFeedArray[1] = sensorDataArray[1] / 101;
            inputArray[1] = currentSample[2] / 101;
      //      positionFeedArray[3] = sensorDataArray[3] / 101;
            inputArray[2] = currentSample[4] / 101;
            inputArray[3] = currentSample[5] / 101;
            inputArray[4] = currentSample[6] / 101;
      //      positionFeedArray[7] = sensorDataArray[7] / 101;
            inputArray[5] = currentSample[8] / 101;
            inputArray[6] = currentSample[9] / 101;
      //      positionFeedArray[10] = sensorDataArray[10] / 101;
            inputArray[7] = currentSample[11] / 101;
            inputArray[8] = currentSample[12] / 101;
      //      positionFeedArray[13] = sensorDataArray[13] / 101;
            inputArray[9] = currentSample[14] / 101;
            inputArray[10] = currentSample[16] / 360;
            inputArray[11] = currentSample[17] / 360;

        } else if(selectNN == 2){

            var inputArray = new Array(12).fill(0);
            inputArray[0] = currentSample[0] / 101;
      //      positionFeedArray[1] = sensorDataArray[1] / 101;
            inputArray[1] = currentSample[2] / 101;
      //      positionFeedArray[3] = sensorDataArray[3] / 101;
            inputArray[2] = currentSample[4] / 101;
            inputArray[3] = currentSample[5] / 101;
            inputArray[4] = currentSample[6] / 101;
      //      positionFeedArray[7] = sensorDataArray[7] / 101;
            inputArray[5] = currentSample[8] / 101;
            inputArray[6] = currentSample[9] / 101;
      //      positionFeedArray[10] = sensorDataArray[10] / 101;
            inputArray[7] = currentSample[11] / 101;
            inputArray[8] = currentSample[12] / 101;
      //      positionFeedArray[13] = sensorDataArray[13] / 101;
            inputArray[9] = currentSample[14] / 101;
            inputArray[10] = currentSample[16] / 360;
            inputArray[11] = currentSample[17] / 360;
        }

  
        trainingData.push({
            input:  inputArray, 
            output: outputArray
        });

        console.log(currentSample + " TRAINING INPUT: " + inputArray + "  --> NN# " + selectNN);
        console.log(currentSample + " TRAINING OUTPUT: " + outputArray + "  --> NN# " + selectNN);
    }

    if(selectNN == 1){
      console.log("TRAINING ON selectNN1");

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
