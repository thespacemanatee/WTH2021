#include <Arduino.h>
#include <ESP32Servo.h>

Servo myservo1, myservo2; // create servo object to control a servo
                          // twelve servo objects can be created on most boards

int pos = 0;     // variable to store the servo position
int command = 1; //1:table 1 down, 2:table 1 up, 3:table 2 down, 4:table 2 up

void setup()
{
  myservo1.attach(12);  // attaches the servo on pin 9 to the servo object
  myservo2.attach(13); // attaches the servo on pin 10 to the servo object
}

void loop()
{
  Serial.println(pos);
  if (command == 1)
  {
    for (pos = 90; pos >= 0; pos -= 1)
    { // table 1 down
      // in steps of 1 degree
      myservo1.write(pos); // tell servo to go to position in variable 'pos'
      delay(20);           // waits 15ms for the servo to reach the position
    }
  }
  if (command == 2)
  {
    for (pos = 0; pos <= 90; pos += 1)
    { // table 1 up
      // in steps of 1 degree
      myservo1.write(pos); // tell servo to go to position in variable 'pos'
      delay(20);           // waits 15ms for the servo to reach the position
    }
  }
  if (command == 3)
  {
    for (pos = 0; pos <= 90; pos += 1)
    { // table 2 down
      // in steps of 1 degree
      myservo2.write(pos); // tell servo to go to position in variable 'pos'
      delay(20);           // waits 15ms for the servo to reach the position
    }
  }
  if (command == 4)
  {
    for (pos = 90; pos >= 0; pos -= 1)
    { // table 2 up
      // in steps of 1 degree
      myservo2.write(pos); // tell servo to go to position in variable 'pos'
      delay(20);           // waits 15ms for the servo to reach the position
    }
  }
}