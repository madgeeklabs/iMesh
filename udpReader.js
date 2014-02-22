var dgram = require("dgram"),
    parser = new require('packet').createParser();

var server = dgram.createSocket("udp4");

var structure = [
    'b32 => Magic',                         // is always 0x526F6455 
    'b8 => Version',                        // Version of message 
    'b8 => Alive',                          // Alivecounter 
    'b8 => VehicleType',                    // Vehicle type 
    'b32 => MileageTotal',                  // Overall milage in km 
    'b16 => SpeedWheelRear',                // Speed @rear wheel in km/h 
    'b16 => SpeedWheelFront',               // Speed @front wheel in km/h 
    '-b16 => Temperature',                  // Outside temperature 
    'b8 => RockerSwitchRightUp',            // Rocker switch (left handle) right up 
    'b8 => RockerSwitchRightDown',          // Rocker switch (left handle) right down 
    'b8 => PushButtonLeftHand',             // Push button left hand 
    'b8 => PushButtonRightHand',            // Push button right hand 
    'b8 => CruiseControlOn',                // Cruise control on 
    'b8 => CruiseControlAccelerate',        // Cruise control accelerate 
    'b8 => CruiseControlDecelerator',       // Cruise control decelerate 
    'b8 => IndicatorSwitchLeft',            // Indicator switch left 
    'b8 => IndicatorSwitchRight',           // Indicator switch right 
    'b8 => IndicatorSwitchReset',           // Indicator switch reset 
    'b8 => Horn',                           // Horn
    'b8 => HighBeam',                       // High beam 
    'b8 => RockerSwitchLeftUp',             // Rocker switch (left handle) left up 
    'b8 => RockerSwitchLeftDown',           // Rocker switch (left handle) left down 
    'b8 => MMCLeft',                        // Multimedia controller left 
    'b8 => MMCRight',                       // Multimedia contoller right 
    'b8 => MMCPosition',                    // Multimedia controller position 
    'b8 => ReadinessDriving',               // Ready to ride 
    'b8 => ChargingCondition',              // Charging condition 
    'b16 => ChargingDurationExpected',      // expected charging duration in min. 
    'b8 => ChargingWirePluggedIn',          // charging wire plugged 
    'b8 => StateOfCharge',                  // SOC – state of charge in % 
    'b8 => Range',                          // Range in km 
    'b16 => EnergyDischarged',              // HV battery energy discharged by consumption 
    'b16 => EnergyChargedByRecuperation',   // HV battery energy charged by recuperation 
    'b16 => HighVoltageStorageVoltage',     // High voltage storage voltage 
    'b16 => HighVoltageStorageCurrent',     // High voltage storage current 
    'b8 => ECOPoints'                       // Economic points 
].join(', ');




// Here the magic happens
server.on("message", function (msg, rinfo) {
    parser.extract(structure, function (record) {
        console.log(record);
    });
    parser.parse(msg);
});



// Who cares LOL
server.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  server.close();
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.bind(30002);
