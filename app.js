document.querySelector('button')
    .addEventListener('click', connectBluetooth)


function connectBluetooth() {
    navigator.bluetooth
        .requestDevice({
            optionalServices: [ 0xffe0 ],
            acceptAllDevices: true
        })
        .then((device) => device.gatt.connect())
        .then((server) => server.getPrimaryService(0xffe0))
        .then((service) => service.getCharacteristic(0xffe1))
        .then((characteristic) => {
            characteristic.addEventListener('characteristicvaluechanged', handleValueChanged)

            return characteristic.startNotifications()
        })
        .catch((err) => console.error(err))
}


function handleValueChanged(event) {
    const decoder = new TextDecoder()
    const value = decoder.decode(event.target.value).split(';')
    const temp = parseInt(value[0], 10)
    const humi = parseInt(value[1], 10)

    const tempEl = document.querySelector('.temp')
    const humiEl = document.querySelector('.humi')

    tempEl.querySelector('span').innerHTML = `${temp}˚C`
    humiEl.querySelector('span').innerHTML = `${humi}%`
}
