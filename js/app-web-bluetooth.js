
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
  var xCoordinate = 0;
  var yCoordinate = 0; 
  var zCoordinate = 0;
  var xCoordinate2 = 0;
  var yCoordinate2 = 0; 
  var zCoordinate2 = 0;

  let accelerometerData, objectTempData, ambientTempData, heartRateData, poseData;


  //3D model arm position sample data
 // var poseDataArray = []; 
  //sensor array sample data
  //var sensorDataArray = new Array(12).fill(0); 
  var sensorDataArray = new Array(18).fill(0); 

  //master session data array of arrays
  var sensorDataSession = [];
  var poseDataSession = [];

  //samples per position for display in ui
  var sensorSamplesPerPosition = new Array(28).fill(0); 

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
  var scoreArray = new Array(28).fill(0);

	var initialised = false;
	var timeout = null;

  button.onclick = function(e){
    var sensorController = new ControllerWebBluetooth("ChildMind");
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
          } else if(loadNNFlag){
              getNNScore(1);
          }
          if(haveNNFlag2 && activeNNFlag2){  //we have a NN and we want to apply to current sensor data
              getNNScore(2);
          } else if(loadNNFlag){
              getNNScore(2);
          }

      }

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

    if(objectTempData){
      var objectTempElement1 = document.getElementsByClassName('object-temp-1-data')[0];
      objectTempElement1.innerHTML = objectTempData.a.toFixed(1);

      var objectTempElement2 = document.getElementsByClassName('object-temp-2-data')[0];
      objectTempElement2.innerHTML = objectTempData.b.toFixed(1);

      var objectTempElement3 = document.getElementsByClassName('object-temp-3-data')[0];
      objectTempElement3.innerHTML = objectTempData.c.toFixed(1);

      var objectTempElement4 = document.getElementsByClassName('object-temp-4-data')[0];
      objectTempElement4.innerHTML = objectTempData.d.toFixed(1);

      var objectTempElement5 = document.getElementsByClassName('object-temp-5-data')[0];
      objectTempElement5.innerHTML = objectTempData.e.toFixed(1);

      var objectTempElement6 = document.getElementsByClassName('object-temp-6-data')[0];
      objectTempElement6.innerHTML = objectTempData.f.toFixed(1);

      var objectTempElement7 = document.getElementsByClassName('object-temp-7-data')[0];
      objectTempElement7.innerHTML = objectTempData.g.toFixed(1);

      var objectTempElement8 = document.getElementsByClassName('object-temp-8-data')[0];
      objectTempElement8.innerHTML = objectTempData.h.toFixed(1);

      var objectTempElement9 = document.getElementsByClassName('object-temp-9-data')[0];
      objectTempElement9.innerHTML = objectTempData.i.toFixed(1);

      var objectTempElement10 = document.getElementsByClassName('object-temp-10-data')[0];
      objectTempElement10.innerHTML = objectTempData.j.toFixed(1);

      var objectTempElement11 = document.getElementsByClassName('object-temp-11-data')[0];
      objectTempElement11.innerHTML = objectTempData.k.toFixed(1);

      var objectTempElement12 = document.getElementsByClassName('object-temp-12-data')[0];
      objectTempElement12.innerHTML = objectTempData.l.toFixed(1);

      var objectTempElement13 = document.getElementsByClassName('object-temp-13-data')[0];
      objectTempElement13.innerHTML = objectTempData.m.toFixed(1);

      var objectTempElement14 = document.getElementsByClassName('object-temp-14-data')[0];
      objectTempElement14.innerHTML = objectTempData.n.toFixed(1);

      var objectTempElement15 = document.getElementsByClassName('object-temp-15-data')[0];
      objectTempElement15.innerHTML = objectTempData.o.toFixed(1);

    }

    if(ambientTempData){
      var ambientTempAverageElement = document.getElementsByClassName('ambient-temp-average-data')[0];
      ambientTempAverageElement.innerHTML = ambientTempData.a;
    }

    if(heartRateData){
      var rawHeartRateData = document.getElementsByClassName('raw-ppg-heart-data')[0];
      rawHeartRateData.innerHTML = heartRateData.a;
    }

  }

  function getSensorData(){

    if(objectTempData){
      sensorDataArray[0] = objectTempData.a.toFixed(1);
      sensorDataArray[1] = objectTempData.b.toFixed(1); //no T2
      sensorDataArray[2] = objectTempData.c.toFixed(1);
      sensorDataArray[3] = objectTempData.d.toFixed(1);  //no T4
      sensorDataArray[4] = objectTempData.e.toFixed(1);
      sensorDataArray[5] = objectTempData.f.toFixed(1);
      sensorDataArray[6] = objectTempData.g.toFixed(1);
      sensorDataArray[7] = objectTempData.h.toFixed(1); //no T8
      sensorDataArray[8] = objectTempData.i.toFixed(1);
      sensorDataArray[9] = objectTempData.j.toFixed(1);
      sensorDataArray[10] = objectTempData.k.toFixed(1);  //no T11
      sensorDataArray[11] = objectTempData.l.toFixed(1);
      sensorDataArray[12] = objectTempData.m.toFixed(1); 
      sensorDataArray[13] = objectTempData.n.toFixed(1); //no T14
      sensorDataArray[14] = objectTempData.o.toFixed(1);
  
    }
    if(ambientTempData){
      sensorDataArray[15] = ambientTempData.a.toFixed(1);
    } 
    if(accelerometerData){
      sensorDataArray[16] = accelerometerData.pitch.toFixed(1);
	    sensorDataArray[17] = accelerometerData.roll.toFixed(1); 
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

      var collectedDataArray =  new Array(19).fill(0);  
      collectedDataArray = sensorDataArray;
      var positionNumber = $('#master-pose-input').val() - 1;

      //add pose # to first element of sensor data array
      collectedDataArray.unshift( positionNumber );

      console.log("web bluetooth sensor data:");

      console.dir(collectedDataArray);

      //add to samples per pose count array
      sensorSamplesPerPosition[positionNumber] = sensorSamplesPerPosition[positionNumber] + 1;

      var labelNumber = positionNumber + 1;

      $("div.console .pose" + labelNumber).html("&nbsp;&nbsp;P" + labelNumber + ":" + "<span>" + sensorSamplesPerPosition[positionNumber] + "</span>");

      //add sample to set
      sensorDataSession.push(collectedDataArray);

      sessionSampleSetIndex.push(numSets);

      console.log("Set Index: "); 
      console.dir(sessionSampleSetIndex);

      getSamplesFlag = getSamplesFlag - 1;

      if(getSamplesFlag == 0){
          //console messages
          var consoleSamples = document.getElementsByClassName('console-samples')[0];
          consoleSamples.innerHTML = sensorDataSession.length;

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
  var neuralNet = new Architect.LSTM(10, 28, 28);
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

    //if leaded NN, turn off
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
  var neuralNet2 = new Architect2.LSTM(12, 6, 28);
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
//	scoreArray = new Array(75).fill(0);

  var firstPlace = {position: 0, score: 0}; 
  var secondPlace = {position: 0, score: 0};  
  var thirdPlace = {position: 0, score: 0}; 

  scoreArray = new Array(28).fill(0);

/*	var feedArray = new Array(10).fill(0);
		    feedArray[0] = sensorDataArray[0] / 101;
        feedArray[1] = sensorDataArray[1] / 101;
        feedArray[2] = sensorDataArray[2] / 101;
        feedArray[3] = sensorDataArray[3] / 101;
        feedArray[4] = sensorDataArray[4] / 101;
        feedArray[5] = sensorDataArray[5] / 101;
        feedArray[6] = sensorDataArray[6] / 101;
        feedArray[7] = sensorDataArray[7] / 101;
        feedArray[8] = sensorDataArray[8] / 101;
        feedArray[9] = sensorDataArray[9] / 101;
    //    feedArray[10] = sensorDataArray[10] / 101;
    //    feedArray[11] = sensorDataArray[11] / 101;
    //    feedArray[12] = sensorDataArray[12] / 101;
    //    feedArray[13] = sensorDataArray[13] / 101;
    //    feedArray[14] = sensorDataArray[14] / 101;
    //    feedArray[10] = sensorDataArray[10] / 360;
    //    feedArray[11] = sensorDataArray[11] / 360;  */

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


    for(var i=0; i<28;i++){

        var scoreForColor = scoreArray[i];
        var $theSpot;

        if(scoreForColor > firstPlace.score  )
        {
            thirdPlace.position = secondPlace.position;
            thirdPlace.score = secondPlace.score;
            secondPlace.position = firstPlace.position;
            secondPlace.score = firstPlace.score;
            firstPlace.position = i + 1;
            firstPlace.score = scoreForColor;
        } else if(scoreForColor > secondPlace.score && firstPlace.position != (i + 1) )
        {
            thirdPlace.position = secondPlace.position;
            thirdPlace.score = secondPlace.score;
            secondPlace.score = scoreForColor;
            secondPlace.position = i + 1;
        } else if(scoreForColor > thirdPlace.score && firstPlace.position != (i + 1) && secondPlace.position != (i + 1) )
        {
            thirdPlace.score = scoreForColor;
            thirdPlace.position = i + 1;
        }

        if(i==0){
          $theSpot = $("div.heat-index1.NN" + selectNN);
        } else if(i==1){
          $theSpot = $("div.heat-index2.NN" + selectNN);
        } else if(i==2){
          $theSpot = $("div.heat-index3.NN" + selectNN);
        } else if(i==3){
          $theSpot = $("div.heat-index4.NN" + selectNN);
        } else if(i==4){
          $theSpot = $("div.heat-index5.NN" + selectNN);
        } else if(i==5){
          $theSpot = $("div.heat-index6.NN" + selectNN);
        } else if(i==6){
          $theSpot = $("div.heat-index7.NN" + selectNN);
        } else if(i==7){
          $theSpot = $("div.heat-index8.NN" + selectNN);
        } else if(i==8){
          $theSpot = $("div.heat-index9.NN" + selectNN);
        } else if(i==9){
          $theSpot = $("div.heat-index10.NN" + selectNN);
        } else if(i==10){
          $theSpot = $("div.heat-index11.NN" + selectNN);
        } else if(i==11){
          $theSpot = $("div.heat-index12.NN" + selectNN);
        } else if(i==12){
          $theSpot = $("div.heat-index13.NN" + selectNN);
        } else if(i==13){
          $theSpot = $("div.heat-index14.NN" + selectNN);
        } else if(i==14){
          $theSpot = $("div.heat-index15.NN" + selectNN);
        } else if(i==15){
          $theSpot = $("div.heat-index16.NN" + selectNN);
        } else if(i==16){
          $theSpot = $("div.heat-index17.NN" + selectNN);
        } else if(i==17){
          $theSpot = $("div.heat-index18.NN" + selectNN);
        } else if(i==18){
          $theSpot = $("div.heat-index19.NN" + selectNN);
        } else if(i==19){
          $theSpot = $("div.heat-index20.NN" + selectNN);
        } else if(i==20){
          $theSpot = $("div.heat-index21.NN" + selectNN);
        } else if(i==21){
          $theSpot = $("div.heat-index22.NN" + selectNN);
        } else if(i==22){
          $theSpot = $("div.heat-index23.NN" + selectNN);
        } else if(i==23){
          $theSpot = $("div.heat-index24.NN" + selectNN);
        } else if(i==24){
          $theSpot = $("div.heat-index25.NN" + selectNN);
        } else if(i==25){
          $theSpot = $("div.heat-index26.NN" + selectNN);
        } else if(i==26){
          $theSpot = $("div.heat-index27.NN" + selectNN);
        } else if(i==27){
          $theSpot = $("div.heat-index28.NN" + selectNN);
        }



        if(scoreForColor > 0.95){
          $theSpot.css("color", "rgb(255,0,0)");
        } else if(scoreForColor > 0.9){
          $theSpot.css("color",  "rgb(255,64,0)");
        } else if(scoreForColor > 0.85){
          $theSpot.css("color", "rgb(255,126,0)");
        } else if(scoreForColor > 0.8){
          $theSpot.css("color", "rgb(255,191,0)");
        } else if(scoreForColor > 0.75){
          $theSpot.css("color",  "rgb(255,255,0)");
        } else if(scoreForColor > 0.7){
          $theSpot.css("color", "rgb(191,255,0)");
        } else if(scoreForColor > 0.6){
          $theSpot.css("color", "rgb(126,255,0)");
        } else if(scoreForColor > 0.55){
          $theSpot.css("color", "rgb(64,255,0)");
        } else if(scoreForColor > 0.5){
          $theSpot.css("color", "rgb(0,255,0)");
        } else if(scoreForColor > 0.45){
          $theSpot.css("color", "rgb(0,255,64)");
        } else if(scoreForColor > 0.4){
          $theSpot.css("color", "rgb(0,255,126)");
        } else if(scoreForColor > 0.35){
          $theSpot.css("color", "rgb(0,255,191)");
        } else if(scoreForColor > 0.3){
          $theSpot.css("color", "rgb(0,255,255)");
        } else if(scoreForColor > 0.25){
          $theSpot.css("color", "rgb(0,191,255)");
        } else if(scoreForColor > 0.2){
          $theSpot.css("color", "rgb(0,126,255)");
        } else if(scoreForColor > 0.15){
          $theSpot.css("color", "rgb(0,64,255)");
        } else if(scoreForColor > 0.1){
          $theSpot.css("color", "rgb(0,0,255)");
        } else if(scoreForColor > 0.05){
          $theSpot.css("color", "rgb(0,0,126)");
        } else if(scoreForColor > 0.01){
          $theSpot.css("color", "rgb(0,0,64)");
        } else {
          $theSpot.css("color", "#6b6b6b");
        } 
    }
    getCoordinates(scoreArray, firstPlace, secondPlace, thirdPlace, selectNN);
}

  function getCoordinates(scoreArray, firstPlace, secondPlace, thirdPlace, selectNN){
      var positionCoordinates = [
        {x: 0,   y: 100, z: 100}, 	//1
        {x: 0,   y: 100, z: 0},   	//2
        {x: 33,  y: 100, z: 100}, 	//3
        {x: 33,  y: 100, z: 0},   	//4
        {x: 66,  y: 100, z: 100}, 	//5
        {x: 66,  y: 100, z: 0},   	//6
        {x: 100, y: 100, z: 100}, 	//7
        {x: 100, y: 100, z: 0},		//8

        {x: 0,   y: 50,  z: 100}, 	//9
        {x: 0,   y: 50,  z: 50}, 	//10
        {x: 0,   y: 50,  z: 0},		//11
        {x: 33,  y: 50,  z: 100}, 	//12
        {x: 33,  y: 50,  z: 50}, 	//13
        {x: 33,  y: 50,  z: 0},		//14
        {x: 66,  y: 50,  z: 100}, 	//15
        {x: 66,  y: 50,  z: 50}, 	//16
        {x: 66,  y: 50,  z: 0},		//17
        {x: 100, y: 50,  z: 100}, 	//18
        {x: 100, y: 50,  z: 50},	//19
        {x: 100, y: 50,  z: 0},   	//20

        {x: 0,   y: 0,   z: 100}, 	//21
        {x: 0,   y: 0,   z: 0},		//22
        {x: 33,  y: 0,   z: 100}, 	//23
        {x: 33,  y: 0,   z: 0},		//24
        {x: 66,  y: 0,   z: 100}, 	//25
        {x: 66,  y: 0,   z: 0},		//26
        {x: 100, y: 0,   z: 100}, 	//27
        {x: 100, y: 0,   z: 0}		//28
      ];
      var xCoordinateNew = ((firstPlace.score * positionCoordinates[firstPlace.position-1].x)*2 + (secondPlace.score * positionCoordinates[secondPlace.position-1].x)*1.5 + (thirdPlace.score * positionCoordinates[thirdPlace.position-1].x)) / (firstPlace.score*2 + secondPlace.score*1.5 + thirdPlace.score);
      var yCoordinateNew = ((firstPlace.score * positionCoordinates[firstPlace.position-1].y)*2 + (secondPlace.score * positionCoordinates[secondPlace.position-1].y)*1.5 + (thirdPlace.score * positionCoordinates[thirdPlace.position-1].y)) / (firstPlace.score*2 + secondPlace.score*1.5 + thirdPlace.score);
      var zCoordinateNew = ((firstPlace.score * positionCoordinates[firstPlace.position-1].z)*2 + (secondPlace.score * positionCoordinates[secondPlace.position-1].z)*1.5 + (thirdPlace.score * positionCoordinates[thirdPlace.position-1].z)) / (firstPlace.score*2 + secondPlace.score*1.5 + thirdPlace.score);
      
      var numeratorX = 0; var numeratorY = 0; var numeratorZ = 0; var denominatorX = 0; var denominatorY = 0; var denominatorZ = 0; var currentScore;

    for(var i=0; i<28;i++){
        currentScore = scoreArray[i];

        if(currentScore > 0.04){ //cutoff for score to count
          numeratorX = numeratorX + (currentScore * positionCoordinates[i].x);
          numeratorY = numeratorY + (currentScore * positionCoordinates[i].y);
          numeratorZ = numeratorZ + (currentScore * positionCoordinates[i].z);

          denominatorX = denominatorX + currentScore;
          denominatorY = denominatorY + currentScore;
          denominatorZ = denominatorZ + currentScore;
        }
    }
    var xCoordinateNew2 = numeratorX / denominatorX;
    var yCoordinateNew2 = numeratorY / denominatorY;
    var zCoordinateNew2 = numeratorZ / denominatorZ;

      //smooth by averaging with last coordinate
      xCoordinate = (xCoordinate*3 + xCoordinateNew)/4;
      yCoordinate = (yCoordinate*3 + yCoordinateNew)/4;
      zCoordinate = (zCoordinate*3 + zCoordinateNew)/4;

      //smooth by averaging with last coordinate
      xCoordinate2 = (xCoordinate*3 + xCoordinateNew2)/4;
      yCoordinate2 = (yCoordinate*3 + yCoordinateNew2)/4;
      zCoordinate2 = (zCoordinate*3 + zCoordinateNew2)/4;

      if(selectNN == 1){
          $("#coordinates1").html("X1A: <p>" + xCoordinate.toFixed(1) + "</p>   Y1A: <p>" + yCoordinate.toFixed(1) + "</p>   Z1A: <p>" + zCoordinate.toFixed(1) + "</p>");
          $("#coordinates2").html("X1B: <p>" + xCoordinate2.toFixed(1) + "</p>   Y1B: <p>" + yCoordinate2.toFixed(1) + "</p>   Z1B: <p>" + zCoordinate2.toFixed(1) + "</p>");
          $("#absolute-position1").css({"top": (80 - yCoordinate) + "%", "left": xCoordinate + "%", "font-size": ((100 - zCoordinate) / 6 + 5) + "rem"});
          $("#absolute-position2").css({"top": (80 - yCoordinate2) + "%", "left": xCoordinate2 + "%", "font-size": ((100 - zCoordinate2) / 6 + 5) + "rem"});
      } else if(selectNN == 2) {
          $("#coordinates3").html("X2A: <p>" + xCoordinate.toFixed(1) + "</p>   Y2A: <p>" + yCoordinate.toFixed(1) + "</p>   Z2A: <p>" + zCoordinate.toFixed(1) + "</p>");
          $("#coordinates4").html("X2B: <p>" + xCoordinate2.toFixed(1) + "</p>   Y2B: <p>" + yCoordinate2.toFixed(1) + "</p>   Z2B: <p>" + zCoordinate2.toFixed(1) + "</p>");
          $("#absolute-position3").css({"top": (80 - yCoordinate) + "%", "left": xCoordinate + "%", "font-size": ((100 - zCoordinate) / 6 + 5) + "rem"});
          $("#absolute-position4").css({"top": (80 - yCoordinate2) + "%", "left": xCoordinate2 + "%", "font-size": ((100 - zCoordinate2) / 6 + 5) + "rem"});
      }

      console.log("FIRST: " + firstPlace.position + " SECOND: " + secondPlace.position + " THIRD: " + thirdPlace.position + " --> NN# " + selectNN);

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

  var trainingData = [];

    for(var i=0; i<sensorDataSession.length; i++){

        var currentSample = sensorDataSession[i];
        var currentPosition = currentSample[0];

        //all positions are false except for the position sample sensor data relates to
     //   var outputArray = new Array(75).fill(0);

        var outputArray = new Array(28).fill(0);

        //the position at which sample was taken is true
        outputArray[currentPosition] = 1; 

 /*       if(selectNN == 1){
            var inputArray = new Array(10).fill(0);
            inputArray[0] = sensorDataArray[0] / 101;
      //      positionFeedArray[1] = sensorDataArray[1] / 101;
            inputArray[1] = sensorDataArray[2] / 101;
      //      positionFeedArray[3] = sensorDataArray[3] / 101;
            inputArray[2] = sensorDataArray[4] / 101;
            inputArray[3] = sensorDataArray[5] / 101;
            inputArray[4] = sensorDataArray[6] / 101;
      //      positionFeedArray[7] = sensorDataArray[7] / 101;
            inputArray[5] = sensorDataArray[8] / 101;
            inputArray[6] = sensorDataArray[9] / 101;
      //      positionFeedArray[10] = sensorDataArray[10] / 101;
            inputArray[7] = sensorDataArray[11] / 101;
            inputArray[8] = sensorDataArray[12] / 101;
      //      positionFeedArray[13] = sensorDataArray[13] / 101;
            inputArray[9] = sensorDataArray[14] / 101;

        } else if(selectNN == 2){

            var inputArray = new Array(12).fill(0);
            inputArray[0] = sensorDataArray[0] / 101;
      //      positionFeedArray[1] = sensorDataArray[1] / 101;
            inputArray[1] = sensorDataArray[2] / 101;
      //      positionFeedArray[3] = sensorDataArray[3] / 101;
            inputArray[2] = sensorDataArray[4] / 101;
            inputArray[3] = sensorDataArray[5] / 101;
            inputArray[4] = sensorDataArray[6] / 101;
      //      positionFeedArray[7] = sensorDataArray[7] / 101;
            inputArray[5] = sensorDataArray[8] / 101;
            inputArray[6] = sensorDataArray[9] / 101;
      //      positionFeedArray[10] = sensorDataArray[10] / 101;
            inputArray[7] = sensorDataArray[11] / 101;
            inputArray[8] = sensorDataArray[12] / 101;
      //      positionFeedArray[13] = sensorDataArray[13] / 101;
            inputArray[9] = sensorDataArray[14] / 101;
            inputArray[10] = sensorDataArray[15] / 360;
            inputArray[11] = sensorDataArray[16] / 360;
        } */

         if(selectNN == 1){
            var inputArray = new Array(10).fill(0);
            inputArray[0] = currentSample[1] / 101;
      //      positionFeedArray[1] = sensorDataArray[1] / 101;
            inputArray[1] = currentSample[3] / 101;
      //      positionFeedArray[3] = sensorDataArray[3] / 101;
            inputArray[2] = currentSample[5] / 101;
            inputArray[3] = currentSample[6] / 101;
            inputArray[4] = currentSample[7] / 101;
      //      positionFeedArray[7] = sensorDataArray[7] / 101;
            inputArray[5] = currentSample[9] / 101;
            inputArray[6] = currentSample[10] / 101;
      //      positionFeedArray[10] = sensorDataArray[10] / 101;
            inputArray[7] = currentSample[12] / 101;
            inputArray[8] = currentSample[13] / 101;
      //      positionFeedArray[13] = sensorDataArray[13] / 101;
            inputArray[9] = currentSample[15] / 101;

        } else if(selectNN == 2){

            var inputArray = new Array(12).fill(0);
            inputArray[0] = currentSample[1] / 101;
      //      positionFeedArray[1] = sensorDataArray[1] / 101;
            inputArray[1] = currentSample[3] / 101;
      //      positionFeedArray[3] = sensorDataArray[3] / 101;
            inputArray[2] = currentSample[5] / 101;
            inputArray[3] = currentSample[6] / 101;
            inputArray[4] = currentSample[7] / 101;
      //      positionFeedArray[7] = sensorDataArray[7] / 101;
            inputArray[5] = currentSample[9] / 101;
            inputArray[6] = currentSample[10] / 101;
      //      positionFeedArray[10] = sensorDataArray[10] / 101;
            inputArray[7] = currentSample[12] / 101;
            inputArray[8] = currentSample[13] / 101;
      //      positionFeedArray[13] = sensorDataArray[13] / 101;
            inputArray[9] = currentSample[15] / 101;
            inputArray[10] = currentSample[17] / 360;
            inputArray[11] = currentSample[18] / 360;
        }

  
        trainingData.push({
            input:  inputArray, 
            output: outputArray
        });

        console.log(currentSample + " TRAINING INPUT: " + inputArray + "  --> NN# " + selectNN);
        console.log(currentSample + " TRAINING OUTPUT: " + outputArray + "  --> NN# " + selectNN);
    }

    if(selectNN == 1){
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
