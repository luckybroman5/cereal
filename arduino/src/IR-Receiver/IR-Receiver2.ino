//www.elegoo.com
//2016.06.13

#include <IRremote.h>
 
int RECV_PIN = 11;
 
IRrecv irrecv(RECV_PIN);
 
decode_results results;
 
void setup()
{
  Serial.begin(9600);
  irrecv.enableIRIn(); //初始化红外遥控
  pinMode(13,1);
}
 
void loop() {
  if (irrecv.decode(&results)) {
    Serial.println(results.value);
    irrecv.resume(); // 接收下一个值
  }
}
