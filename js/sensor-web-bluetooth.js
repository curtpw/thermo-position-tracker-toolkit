/**
* @author Charlie Gerard / http://charliegerard.github.io
*/

const services = {
  controlService: {
    name: 'control service',
  //  uuid: '0000a009-0000-1000-8000-00805f9b34fb' //Thermo V1
    uuid: '0000a000-0000-1000-8000-00805f9b34fb'  //Thermo V2
  }
}

const characteristics = {
  commandReadCharacteristic: {
    name: 'command read characteristic',
    uuid: '0000a001-0000-1000-8000-00805f9b34fb'
  },
  commandWriteCharacteristic: {
    name: 'command write characteristic',
    uuid: '0000a002-0000-1000-8000-00805f9b34fb'
  },
  imuDataCharacteristic: {
    name: 'imu data characteristic',
    uuid: '0000a003-0000-1000-8000-00805f9b34fb'
  }
}

var _this;
var state = {};
state.objectTemp = new Array(22).fill(0); 


var sendCommandFlag = false; //global to keep track of when command is sent back to device
 let commandValue = new Uint8Array([0x01,3,0x02,0x03,0x01]);   //command to send back to device

class ControllerWebBluetooth{
  constructor(name){
    _this = this;
    this.name = name;
    this.services = services;
    this.characteristics = characteristics;

    this.standardServer;
  }

  connect(){
    return navigator.bluetooth.requestDevice({
      filters: [
        {name: this.name},
        {
          services: [ services.controlService.uuid]
        }
      ]
    })
    .then(device => {
      console.log('Device discovered', device.name);
      return device.gatt.connect();
    })
    .then(server => {
      console.log('server device: '+ Object.keys(server.device));

      this.getServices([services.controlService,], [characteristics.commandReadCharacteristic, characteristics.commandWriteCharacteristic, characteristics.imuDataCharacteristic], server);
    })
    .catch(error => {console.log('error',error)})
  }

  getServices(requestedServices, requestedCharacteristics, server){
    this.standardServer = server;

    requestedServices.filter((service) => {
      if(service.uuid == services.controlService.uuid){
        _this.getControlService(requestedServices, requestedCharacteristics, this.standardServer);
      }
    })
  }

  getControlService(requestedServices, requestedCharacteristics, server){
      let controlService = requestedServices.filter((service) => { return service.uuid == services.controlService.uuid});
      let commandReadChar = requestedCharacteristics.filter((char) => {return char.uuid == characteristics.commandReadCharacteristic.uuid});
      let commandWriteChar = requestedCharacteristics.filter((char) => {return char.uuid == characteristics.commandWriteCharacteristic.uuid});

      // Before having access to IMU, EMG and Pose data, we need to indicate to the Myo that we want to receive this data.
      return server.getPrimaryService(controlService[0].uuid)
      .then(service => {
        console.log('getting service: ', controlService[0].name);
        return service.getCharacteristic(commandWriteChar[0].uuid);
      })
      .then(characteristic => {
        console.log('getting characteristic: ', commandWriteChar[0].name);
        // return new Buffer([0x01,3,emg_mode,imu_mode,classifier_mode]);
        // The values passed in the buffer indicate that we want to receive all data without restriction;
        let commandValue = new Uint8Array([0x01,3,0x02,0x03,0x01]);
        characteristic.writeValue(commandValue);
      })
      .then(_ => {

        let IMUDataChar = requestedCharacteristics.filter((char) => {return char.uuid == characteristics.imuDataCharacteristic.uuid});

          console.log('getting service: ', controlService[0].name);
          _this.getIMUData(controlService[0], IMUDataChar[0], server);

      })
      .catch(error =>{
        console.log('error: ', error);
      })
  }

    sendControlService(requestedServices, requestedCharacteristics, server){
      let controlService = requestedServices.filter((service) => { return service.uuid == services.controlService.uuid});
      let commandReadChar = requestedCharacteristics.filter((char) => {return char.uuid == characteristics.commandReadCharacteristic.uuid});
      let commandWriteChar = requestedCharacteristics.filter((char) => {return char.uuid == characteristics.commandWriteCharacteristic.uuid});

      // Before having access to IMU, EMG and Pose data, we need to indicate to the Myo that we want to receive this data.
      return server.getPrimaryService(controlService[0].uuid)
      .then(service => {
        console.log('getting service: ', controlService[0].name);
        return service.getCharacteristic(commandWriteChar[0].uuid);
      })
      .then(characteristic => {
        console.log('getting write command to device characteristic: ', commandWriteChar[0].name);
        // return new Buffer([0x01,3,emg_mode,imu_mode,classifier_mode]);
        // The values passed in the buffer indicate that we want to receive all data without restriction;
      // TOP  let commandValue = new Uint8Array([0x01,3,0x02,0x03,0x01]);
        characteristic.writeValue(commandValue);
      })
      .then(_ => {

      //  let IMUDataChar = requestedCharacteristics.filter((char) => {return char.uuid == characteristics.imuDataCharacteristic.uuid});
      console.log("COMMAND SENT TO DEVICE");
      sendCommandFlag = false;
       //   console.log('getting service: ', controlService[0].name);
        //  _this.getIMUData(controlService[0], IMUDataChar[0], server);

      })
      .catch(error =>{
        sendCommandFlag = false;
        console.log("COMMAND SEND ERROR");
        console.log('error: ', error);
      })
  }


  handleIMUDataChanged(event){
    //byteLength of ImuData DataView object is 20.
    // imuData return {{orientation: {w: *, x: *, y: *, z: *}, accelerometer: Array, gyroscope: Array}}
    let imuData = event.target.value;

    //last determines if we have first or second half of data
    let packetPosition =  (event.target.value.getUint8(19));

    //add 65 and multiply by 7 to decompress thermopile data

    if(packetPosition == 0){


    let objectTemp1   = ( event.target.value.getUint8(0) / 8) + 70;
    let objectTemp2   = ( event.target.value.getUint8(1) / 8) + 70;
    let objectTemp3   = ( event.target.value.getUint8(2) / 8) + 70;
    let objectTemp4   = ( event.target.value.getUint8(3) / 8) + 70;
    let objectTemp5   = ( event.target.value.getUint8(4) / 8) + 70;
    let objectTemp6   = ( event.target.value.getUint8(5) / 8) + 70;
    let objectTemp7   = ( event.target.value.getUint8(6) / 8) + 70;
    let objectTemp8   = ( event.target.value.getUint8(7) / 8) + 70;
    let objectTemp9   = ( event.target.value.getUint8(8) / 8) + 70;
    let objectTemp10  = ( event.target.value.getUint8(9) / 8) + 70;
    let objectTemp11  = ( event.target.value.getUint8(10) / 8) + 70;
    let objectTemp12  = ( event.target.value.getUint8(11) / 8) + 70;
    let objectTemp13  = ( event.target.value.getUint8(12) / 8) + 70;
    let objectTemp14  = ( event.target.value.getUint8(13) / 8) + 70;
    let objectTemp15  = ( event.target.value.getUint8(14) / 8) + 70;
    let objectTemp16  = ( event.target.value.getUint8(15) / 8) + 70;
    let objectTemp17  = ( event.target.value.getUint8(16) / 8) + 70;
    let objectTemp18  = ( event.target.value.getUint8(17) / 8) + 70;
    let objectTemp19  = ( event.target.value.getUint8(18) / 8) + 70;

    state.objectTemp[0] = objectTemp1;
    state.objectTemp[1] = objectTemp2;
    state.objectTemp[2] = objectTemp3;
    state.objectTemp[3] = objectTemp4;
    state.objectTemp[4] = objectTemp5;
    state.objectTemp[5] = objectTemp6;
    state.objectTemp[6] = objectTemp7;
    state.objectTemp[7] = objectTemp8;
    state.objectTemp[8] = objectTemp9;
    state.objectTemp[9] = objectTemp10;
    state.objectTemp[10] = objectTemp11;
    state.objectTemp[11] = objectTemp12;
    state.objectTemp[12] = objectTemp13;
    state.objectTemp[13] = objectTemp14;
    state.objectTemp[14] = objectTemp15;
    state.objectTemp[15] = objectTemp16;
    state.objectTemp[16] = objectTemp17;
    state.objectTemp[17] = objectTemp18;
    state.objectTemp[18] = objectTemp19;

 //   console.log("ObjT1: " + state.objectTemp[0]);
   
  } else if(packetPosition == 1) {
    let objectTemp20        = ( event.target.value.getUint8(0) / 8) + 70;
    let objectTemp21        = ( event.target.value.getUint8(1) / 8) + 70;
    let objectTemp22        = ( event.target.value.getUint8(2) / 8) + 70;

    let distance1           = ( event.target.value.getUint8(3) );
    let distance2           = ( event.target.value.getUint8(4) );
    let distance3           = ( event.target.value.getUint8(5) );

    let accelerometerPitch  = (event.target.value.getUint8(6) * 1.4);
    let accelerometerRoll   = (event.target.value.getUint8(7) * 1.4);

    let ambientAverage      = ( event.target.value.getUint8(8) / 8) + 70;

    let accelerometerX      = (event.target.value.getUint8(10) / 100) - 1;
    let accelerometerY      = (event.target.value.getUint8(11) / 100) - 1;
    let accelerometerZ      = (event.target.value.getUint8(12) / 100) - 1;

    let batteryVal          = (event.target.value.getUint8(13) / 100) - 1;

    state.objectTemp[19] = objectTemp20;
    state.objectTemp[20] = objectTemp21;
    state.objectTemp[21] = objectTemp22;

    state.distance1 = distance1;
    state.distance2 = distance2;
    state.distance3 = distance3;

    state.pitch = accelerometerPitch;
    state.roll = accelerometerRoll;

    state.ambientTemp = ambientAverage;

    state.accX = accelerometerX;
    state.accY = accelerometerY;
    state.accZ = accelerometerZ;

    state.battery = batteryVal;

   // console.log("Distance1: " + state.distance1);
  }


/*
    var data = {
      accelerometer: {
        pitch: accelerometerPitch,
        roll: accelerometerRoll
      },
      objectTemp: {
        a: objectTemp1,
        b: objectTemp2,
        c: objectTemp3,
        d: objectTemp4,
        e: objectTemp5,
        f: objectTemp6,
        g: objectTemp7,
        h: objectTemp8,
        i: objectTemp9,
        j: objectTemp10,
        k: objectTemp11,
        l: objectTemp12,
        m: objectTemp13,
        n: objectTemp14,
        o: objectTemp15,
    //   p: objectTemp16,
      },
      ambientTemp: {
        a: ambientAverage
      },
      heartRate: {
        a: heartRateRaw
      }
    }

    state = {
      orientation: data.orientation,
      accelerometer: data.accelerometer,
      objectTemp: data.objectTemp,
      ambientTemp: data.ambientTemp,
      heartRate: data.heartRate
    }
    */

    if(sendCommandFlag){
      sendCommandFlag = false;
        sendControlService();
    }

    _this.onStateChangeCallback(state);
  }

  onStateChangeCallback() {}

  getIMUData(service, characteristic, server){
    return server.getPrimaryService(service.uuid)
    .then(newService => {
      console.log('getting characteristic: ', characteristic.name);
      return newService.getCharacteristic(characteristic.uuid)
    })
    .then(char => {
      char.startNotifications().then(res => {
        char.addEventListener('characteristicvaluechanged', _this.handleIMUDataChanged);
      })
    })
  }

  handlePoseChanged(event){

    _this.onStateChangeCallback(state);
  }
/*
  eventArmSynced(arm, x_direction){
    armType = (arm == 1) ? 'right' : ((arm == 2) ? 'left' : 'unknown');
    myoDirection = (x_direction == 1) ? 'wrist' : ((x_direction == 2) ? 'elbow' : 'unknown');

    state.armType = armType;

    _this.onStateChangeCallback(state);
  }
  */

  onStateChange(callback){
    _this.onStateChangeCallback = callback;
  }
}
