var bleno = require('bleno');
var fs = require('fs');
var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;
var util = require('util');
var config = require('./config.json')
console.log('bleno - iBeacon');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    // bleno.startAdvertisingIBeacon('e2c56db5dffb48d2b060d0f5a71096e0', 0, 0, -59);
    bleno.startAdvertising(config.name, [config.id]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

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
      // new WriteOnlyCharacteristic(),
      new DynamicReadOnlyCharacteristic()
    ]
  });
}

var WriteOnlyCharacteristic = function() {
  WriteOnlyCharacteristic.super_.call(this, {
    uuid: 'fffffffffffffffffffffffffffffff3',
    properties: ['write', 'writeWithoutResponse']
  });
};

util.inherits(WriteOnlyCharacteristic, BlenoCharacteristic);

WriteOnlyCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('WriteOnlyCharacteristic write request: ' + data.toString('hex') + ' ' + offset + ' ' + withoutResponse);

  callback(this.RESULT_SUCCESS);
};

util.inherits(SampleService, BlenoPrimaryService);

var DynamicReadOnlyCharacteristic = function() {
  DynamicReadOnlyCharacteristic.super_.call(this, {
    uuid: 'fffffffffffffffffffffffffffffff1',
    properties: ['read']
  });
};

util.inherits(DynamicReadOnlyCharacteristic, BlenoCharacteristic);

DynamicReadOnlyCharacteristic.prototype.onReadRequest = function(offset, callback) {
	console.log('read request');
  var result = this.RESULT_SUCCESS;
  var data = new Buffer('asdf');

  if (offset > data.length) {
    result = this.RESULT_INVALID_OFFSET;
    data = null;
  }

  callback(result, data);
};
