document.querySelector('button')
    .addEventListener('click', connectBluetooth)


async function connectBluetooth() {
    const device = await navigator.bluetooth.requestDevice({
        optionalServices: [ 0xffe0 ],
        acceptAllDevices: true
    })
    const server = await device.gatt.connect()
    const service = await server.getPrimaryService(0xffe0)
    const characteristic = await service.getCharacteristic(0xffe1)

    characteristic.addEventListener('characteristicvaluechanged', handleValueChanged)

    return await characteristic.startNotifications();
}

function handleValueChanged(event) {
    const decoder = new TextDecoder()
    const value = decoder.decode(event.target.value).split(';')
    const temp = parseInt(value[0], 10)
    const humi = parseInt(value[1], 10)

    document.querySelector('.temp').querySelector('span').innerHTML = `${temp}˚C`
    document.querySelector('.humi').querySelector('span').innerHTML = `${humi}%`
}
