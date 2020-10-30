
function init():number {
    pins.digitalWritePin(DigitalPin.P0, 0)
    control.waitMicros(500)
    pins.digitalWritePin(DigitalPin.P0, 1)
    control.waitMicros(70)
    let b = pins.digitalReadPin(DigitalPin.P0)
    control.waitMicros(500)
    return b
}

function writeBit(b:number){
    if ( b==1){
            pins.digitalWritePin(DigitalPin.P0, 0)
            control.waitMicros(1)
            pins.digitalWritePin(DigitalPin.P0, 1)
            control.waitMicros(60)
    }
    else{
            pins.digitalWritePin(DigitalPin.P0, 0)
            control.waitMicros(60)
            pins.digitalWritePin(DigitalPin.P0, 1)
            control.waitMicros(10)
    }
}

function writeByte(byte:number){
    let i;
    for(i=0;i<8;i++){
        if(byte&1){
            writeBit(1)
        }
        else {
            writeBit(0)
        }
        byte = byte >> 1
    }
}

function readBit() : number  {
    pins.digitalWritePin(DigitalPin.P0, 0)
    control.waitMicros(1)
    pins.digitalReadPin(DigitalPin.P0)
    control.waitMicros(10)
    let b = pins.digitalReadPin(DigitalPin.P0)
    control.waitMicros(100)
    pins.digitalWritePin(DigitalPin.P0, 1)
    return b;
}

function readByte():number {
    let byte = 0
    for ( let i = 0; i<8; i++){
        byte = byte | readBit() << i;
    }
    return byte
}

function convert() : number {
    writeByte(0x44)
    let j
    for(j = 1; j<1000; j++) {
        control.waitMicros(1000);
        if ( readBit() == 1 ) {
            break
        }
    }
    return j
}

function get_temperature():number {
    init()
    writeByte(0xCC);
    convert()
    init()
    writeByte(0xcc)
    writeByte(0xbe)
    let b1 = readByte()
    let b2 = readByte()
    let temp:number = (b2 << 8 | b1)
    return temp / 16
}