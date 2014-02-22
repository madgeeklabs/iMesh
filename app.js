var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;
var util = require('util');

console.log('bleno - iBeacon');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    // bleno.startAdvertisingIBeacon('e2c56db5dffb48d2b060d0f5a71096e0', 0, 0, -59);
    bleno.startAdvertising('mglData', ['fffffffffffffffffffffffffffffff0']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart');
  if (!error) {
    bleno.setServices([
      new SampleService()
    ]);
  }
});

bleno.on('advertisingStop', function() {
  console.log('on -> advertisingStop');
});

function SampleService() {
  SampleService.super_.call(this, {
    uuid: 'fffffffffffffffffffffffffffffff0',
    characteristics: [ 
      new DynamicReadOnlyCharacteristic()
    ]
  });
}

var DynamicReadOnlyCharacteristic = function() {
  DynamicReadOnlyCharacteristic.super_.call(this, {
    uuid: 'fffffffffffffffffffffffffffffff2',
    properties: ['read']
  });
};

util.inherits(DynamicReadOnlyCharacteristic, BlenoCharacteristic);

DynamicReadOnlyCharacteristic.prototype.onReadRequest = function(offset, callback) {
	console.log('read request');
  var result = this.RESULT_SUCCESS;
  var data = new Buffer(1);

  if (offset > data.length) {
    result = this.RESULT_INVALID_OFFSET;
    data = null;
  }

  callback(result, data);
};