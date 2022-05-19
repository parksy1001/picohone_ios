/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import CustomModalBackConnect from '../../../component/CustomModalBackConnect';
import base64 from 'react-native-base64';
import Buffer from 'buffer';
import {bytesToString} from 'convert-string';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  // NativeAppEventEmitter,
  Platform,
  PermissionsAndroid,
  // AppState,
  Dimensions,
} from 'react-native';
import {BleManager, ScanMode} from 'react-native-ble-plx';
import colors from '../../../src/colors';

export const bleManager = new BleManager();
export default class FindPicoToScan extends Component {
  constructor() {
    super();
    this.state = {
      scanning: false,
      scanEnd: false,
      isConnected: -1,
      peripherals: new Map(),
      appState: '',
    };
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    // 어떤 부분인지 정확히 모르겠지만 없어도 돌아가길래 주석처리
    // this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    // this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    // this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    // 어떤 부분인지 정확히 모르겠지만 없어도 돌아가길래 주석처리
    /*
    AppState.addEventListener('change', this.handleAppStateChange);
    NativeAppEventEmitter.addListener('bleManagerDiscoverPeripheral', (data) => {
      console.log(data);
    });
    */

    // bleManager.start({ showAlert: false });
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ).then((result) => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ).then((result) => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    } else if (Platform.OS === 'ios') {
    }

    this.startScan();
  }

  componentWillUnmount() {
    if (PicoDevice.device != null) {
      PicoDevice.device.cancelConnection();
    }
  }

  render() {
    const {strings} = this.props.route.params;

    return (
      <View style={styles.container}>
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={colors.azure} />
        </View>
        {this.state.isConnected === -1 ? null : this.state.isConnected === 1 ? (
          this.props.navigation.navigate('Scan')
        ) : (
          <CustomModalBackConnect
            modalHeaderText={strings.connecting_popup_error_title}
            modalSubText={strings.connecting_popup_error_contents}
            close="No"
          />
        )}
      </View>
    );
  }

  startScan() {
    if (!this.state.scanning) {
      // this.setState({peripherals: new Map()});
      bleManager.startDeviceScan(
        null,
        {scanMode: ScanMode.LowLatency, allowDuplicates: false},
        (err, device) => {
          if (err) console.log(err);
          else {
            this.handleDiscoverPeripheral(device);
          }
        },
      );
      this.setState({scanning: true});
      setTimeout(() => {
        bleManager.stopDeviceScan();
        this.handleStopScan();
      }, 4000);
    }
  }

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({scanning: false, scanEnd: true});

    let picos = [];
    // this.state.peripherals.entries();
    for (const [key, value] of this.state.peripherals) {
      if (value.name === 'Bandi-Pico') {
        picos.push(value);
      }
    }

    if (picos.length > 1)
      picos.sort((a, b) => (a.rssi < b.rssi ? 1 : a.rssi > b.rssi ? -1 : 0));
    this.connect(picos[0]);
  }

  // 어떤 부분인지 정확히 모르겠지만 없어도 돌아가길래 주석처리
  /*
  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');

      bleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({ appState: nextAppState });
  }
  */

  /*
  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({ peripherals });
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  handleUpdateValueForCharacteristic(data) {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }
  */

  handleDiscoverPeripheral(peripheral) {
    let peripherals = this.state.peripherals;
    // console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }

    peripherals.set(peripheral.id, peripheral);
    this.setState({peripherals});
  }

  /*
  retrieveConnected() {
    bleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length === 0) {
        console.log('No connected peripherals');
      }

      var peripherals = this.state.peripherals;
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        console.log(peripheral.id);
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals });
      }
    });
  }
  */

  async connectAndPrepare(peripheral, service, characteristic) {
    // Connect to device
    await bleManager.connect(peripheral).then(async () => {
      this.setState({isConnected: 1});
    });
    // Before startNotification you need to call retrieveServices
    await bleManager
      .retrieveServices(peripheral)
      .then(async (peripheralInfo) => {
        console.log('-------', await peripheralInfo);
      });
    // To enable bleManagerDidUpdateValueForCharacteristic listener
    await bleManager.startNotification(peripheral, service, characteristic);
    // Add event listener
    bleManagerEmitter.addListener(
      'bleManagerDidUpdateValueForCharacteristic',
      ({value, peripheral, characteristic, service}) => {
        console.log('aawdknajsbfkjansblgkbaslkdblksabfklabsflkbaslfk');
        // Convert bytes array to string
        const data = bytesToString(value);
        console.log(`Recieved ${data} for characteristic ${characteristic}`);
      },
    );

    bleManagerEmitter.emit(
      'bleManagerDidUpdateValueForCharacteristic',
      0x01,
      peripheral,
      characteristic,
      service,
    );
    bleManager.start;
    setTimeout(async () => {
      let result = await bleManager.read(peripheral, service, characteristic);
      console.log(result);
    }, 200);
    // Actions triggereng bleManagerDidUpdateValueForCharacteristic event
  }

  async connect(peripheral) {
    if (peripheral) {
      if (peripheral.connected) {
        bleManager.cancelDeviceConnection(peripheral.id);
        this.setState({isConnected: 0});
      } else {
        // await this.connectAndPrepare(peripheral.id, serviceUUID, characteristicUUID);
        bleManager.connectToDevice(peripheral.id).then((device) => {
          // console.log(device);
          let peripherals = this.state.peripherals;
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            this.setState({peripherals});
          }
          if (p.connected) {
            this.setState({isConnected: 1});
            DeviceInfo.device = device;
            this.readData(device, peripheral);
          }
        });
      }
    } else {
      this.setState({isConnected: 0});
    }
    // console.log(this.state.isConnected);
  }

  async readData(device, peripheral) {
    let serviceUUID = '0000ffb0-0000-1000-8000-00805f9b34fb';
    let characteristicUUID = '0000ffb3-0000-1000-8000-00805f9b34fb';
    device.discoverAllServicesAndCharacteristics().then(() => {
      device.services().then((services) => {
        Promise.all(
          bleManager.writeCharacteristicWithResponseForDevice(
            peripheral.id,
            '0000ffe0-0000-1000-8000-00805f9b34fb',
            '0000ffe1-0000-1000-8000-00805f9b34fb',
            base64.encode('1'),
          ),
          bleManager.writeCharacteristicWithResponseForDevice(
            peripheral.id,
            '0000ffd0-0000-1000-8000-00805f9b34fb',
            '0000ffd1-0000-1000-8000-00805f9b34fb',
            base64.encode('1'),
          ),
          bleManager.writeCharacteristicWithResponseForDevice(
            peripheral.id,
            '0000ffc0-0000-1000-8000-00805f9b34fb',
            '0000ffc1-0000-1000-8000-00805f9b34fb',
            base64.encode('1'),
          ),
        )
          .then((data) => {
            DeviceInfo.setup = true;
            for (let i = 1; i <= 3; i++) {
              setTimeout(() => {
                bleManager
                  .readCharacteristicForDevice(
                    peripheral.id,
                    serviceUUID,
                    characteristicUUID,
                  )
                  .then((value) => {
                    let data = getValues(value.value);
                    DeviceInfo.data = data;
                    return data;
                  });
              }, 3000 * i);
            }
          })
          .catch((err) => console.error(err));
      });
    });
  }
}

const DeviceInfo = {
  device: null,
  data: null,
  setup: false,

  reload: function () {
    if (DeviceInfo.device == null)
      DeviceInfo.device = bleManager.connectedDevices([])[0];
    let serviceUUID = '0000ffb0-0000-1000-8000-00805f9b34fb';
    let characteristicUUID = '0000ffb3-0000-1000-8000-00805f9b34fb';
    let device = DeviceInfo.device;
    if (device == null) return;
    if (!device.isConnected) return;
    if (!DeviceInfo.setup) {
      device.discoverAllServicesAndCharacteristics().then(() => {
        device.services().then((services) => {
          Promise.all(
            bleManager.writeCharacteristicWithResponseForDevice(
              device.id,
              '0000ffe0-0000-1000-8000-00805f9b34fb',
              '0000ffe1-0000-1000-8000-00805f9b34fb',
              base64.encode('1'),
            ),
            bleManager.writeCharacteristicWithResponseForDevice(
              device.id,
              '0000ffd0-0000-1000-8000-00805f9b34fb',
              '0000ffd1-0000-1000-8000-00805f9b34fb',
              base64.encode('1'),
            ),
            bleManager.writeCharacteristicWithResponseForDevice(
              device.id,
              '0000ffc0-0000-1000-8000-00805f9b34fb',
              '0000ffc1-0000-1000-8000-00805f9b34fb',
              base64.encode('1'),
            ),
          )
            .then((data) => {
              console.log('ready read');
              // console.log(data);
              DeviceInfo.setup = true;
              setTimeout(() => {
                bleManager
                  .readCharacteristicForDevice(
                    device.id,
                    serviceUUID,
                    characteristicUUID,
                  )
                  .then((value) => {
                    // console.log('start read data:');
                    // console.log(value);
                    let data = getValues(value.value);
                    DeviceInfo.data = data;
                    // console.log(data);
                    return data;
                  });
              }, 3000);
            })
            .catch((err) => console.error(err));
        });
      });
    } else {
      bleManager
        .readCharacteristicForDevice(device.id, serviceUUID, characteristicUUID)
        .then((value) => {
          // console.log('start read data:');
          let data = getValues(value.value);
          DeviceInfo.data = data;
          return data;
        });
    }
  },
};

export const PicoDevice = DeviceInfo;

function getValues(val) {
  let val2 = Buffer.Buffer.from(val, 'base64');

  return {
    pm25: {
      value: val2[0] * 256 + val2[1],
      level: val2[2],
    },
    pm10: {
      value: val2[3] * 256 + val2[4],
      level: val2[5],
    },
    temp: {
      value: parseInt((val2[6] * 256 + val2[7]) / 10),
      level: val2[8],
    },
    humd: {
      value: parseInt((val2[9] * 256 + val2[10]) / 10),
      level: val2[11],
    },
    co2: {
      value: val2[12] * 256 + val2[13],
      level: val2[14],
    },
    vocs: {
      value: val2[15] * 256 + val2[16],
      level: val2[17],
    },
  };
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    height: height,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  titleViewStyle: {
    width: width * 0.85,
    marginTop: height * 0.0423,
  },
  title: {
    width: width * 0.85,
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 20,
    color: colors.azure,
  },
  textViewStyle: {
    width: width * 0.85,
    marginTop: 16,
  },
  text: {
    width: width * 0.85,
    fontFamily: 'NotoSans',
    fontSize: 14,
    lineHeight: 20,
    color: '#757575',
  },
  wifiView: {
    marginTop: height * 0.181,
    alignItems: 'center',
    maxHeight: height * 0.35,
  },
  buttonView: {position: 'absolute', top: height * 0.74},
  button: {
    width: width * 0.85,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.azure,
    shadowColor: 'rgba(0, 172, 255, 0.2)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 1,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 14,
    color: colors.white,
  },
});
