#include <Arduino.h> 
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_ADS1X15.h>
#include <RTClib.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <WiFi.h>
#include <HTTPClient.h>

// ==========================================
// KREDENSIAL WIFI & SERVER VERCEL
// ==========================================
const char* ssid = "Sagi56A";         
const char* password = "m4rk1n05A"; 
const String serverName = "https://dashboardhidroponik-git-main-yordanpascaladewas-projects.vercel.app/api/telemetry";

// ==========================================
// 1. DEFINISI PIN HARDWARE ESP32
// ==========================================
#define I2C_SDA 32
#define I2C_SCL 33

#define PIN_RELAY_NUTRISI_A 26
#define PIN_RELAY_NUTRISI_B 27
#define PIN_RELAY_PH_UP     25

#define PIN_ENCODER_CLK 18
#define PIN_ENCODER_DT  19
#define PIN_ENCODER_SW  23

#define PIN_SUHU_DS18B20 5

// ==========================================
// 2. INISIALISASI OBJEK KOMPONEN
// ==========================================
LiquidCrystal_I2C lcd(0x27, 20, 4); 
Adafruit_ADS1115 ads; 
RTC_DS3231 rtc;
OneWire oneWire(PIN_SUHU_DS18B20);
DallasTemperature sensorSuhu(&oneWire);

// Prototype
void bacaSemuaSensor();
void perbaruiTampilanLCD();
void bacaRotaryEncoder();
void kelolaWaktuDanUsia();
void kirimDataKeWeb();

// State & UI Menu
enum MenuState { MONITOR, PILIH_TANAMAN, SET_USIA };
MenuState currentState = MONITOR;

enum DosingState { RUNNING_NORMAL, PH_UP_INJECT, TDS_INJECT_A, TDS_JEDA, TDS_INJECT_B, TUNGGU_REAKSI };
DosingState currentSystemState = RUNNING_NORMAL;

String daftarTanaman[] = {"SELADA", "PAKCOY", "BAYAM", "KANGKUNG"};
int jumlahTanaman = 4;
int indeksTanaman = 0;

bool sudahSetTanggal = false;
int usiaAwalBibit = 1;
int usiaAktual = 0;
int hariTerakhirDicek = -1; 

// Variabel Sensor
float currentPH = 0.0;
float currentPPM = 0.0;
float temperature = 0.0;

// Target Parameter 
float targetPH_Minimal = 5.5;
float targetPPM_Minimal = 1000.0; 

// Rotary Encoder & Timer
int lastStateCLK;
unsigned long lastButtonPress = 0;
unsigned long lastSensorRead = 0;
unsigned long lastLCDUpdate = 0;
unsigned long dosingTimer = 0; 
unsigned long lastDataSent = 0; 

void setup() {
  Serial.begin(115200);
  
  // Koneksi WiFi
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  
  Wire.begin(I2C_SDA, I2C_SCL);
  
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0); lcd.print("SISTEM HIDROPONIK V5");
  lcd.setCursor(0, 1); lcd.print(" UNIVERSAL SYSTEM   ");
  delay(2000);

  ads.begin(0x48); 
  rtc.begin();
  sensorSuhu.begin();

  pinMode(PIN_RELAY_NUTRISI_A, OUTPUT);
  pinMode(PIN_RELAY_NUTRISI_B, OUTPUT);
  pinMode(PIN_RELAY_PH_UP, OUTPUT);
  
  digitalWrite(PIN_RELAY_NUTRISI_A, HIGH);
  digitalWrite(PIN_RELAY_NUTRISI_B, HIGH);
  digitalWrite(PIN_RELAY_PH_UP, HIGH);

  pinMode(PIN_ENCODER_CLK, INPUT_PULLUP);
  pinMode(PIN_ENCODER_DT, INPUT_PULLUP);
  pinMode(PIN_ENCODER_SW, INPUT_PULLUP);
  lastStateCLK = digitalRead(PIN_ENCODER_CLK);
}

void loop() {
  bacaRotaryEncoder();

  if (millis() - lastSensorRead > 1000) {
    bacaSemuaSensor();
    lastSensorRead = millis();
  }

  if (millis() - lastLCDUpdate > 500) {
    perbaruiTampilanLCD();
    lastLCDUpdate = millis();
  }

  kelolaWaktuDanUsia();

  // --- NGIRIM DATA KE VERCEL SETIAP 2 DETIK (REAL-TIME POLLING) ---
  if (sudahSetTanggal && (millis() - lastDataSent > 2000)) {
    kirimDataKeWeb();
    lastDataSent = millis();
  }

  if (!sudahSetTanggal) {
    digitalWrite(PIN_RELAY_NUTRISI_A, HIGH);
    digitalWrite(PIN_RELAY_NUTRISI_B, HIGH);
    digitalWrite(PIN_RELAY_PH_UP, HIGH);
    return; 
  }

  switch (currentSystemState) {
    case RUNNING_NORMAL:
      if (currentPH < targetPH_Minimal) {
        currentSystemState = PH_UP_INJECT;
        digitalWrite(PIN_RELAY_PH_UP, LOW); 
        dosingTimer = millis();             
      } 
      else if (currentPPM < targetPPM_Minimal) {
        currentSystemState = TDS_INJECT_A;
        digitalWrite(PIN_RELAY_NUTRISI_A, LOW); 
        dosingTimer = millis();
      }
      break;

    case PH_UP_INJECT:
      if (millis() - dosingTimer >= 2000) {     
        digitalWrite(PIN_RELAY_PH_UP, HIGH);    
        currentSystemState = TUNGGU_REAKSI;
        dosingTimer = millis();                 
      }
      break;

    case TDS_INJECT_A:
      if (millis() - dosingTimer >= 2000) {
        digitalWrite(PIN_RELAY_NUTRISI_A, HIGH); 
        currentSystemState = TDS_JEDA;
        dosingTimer = millis();
      }
      break;

    case TDS_JEDA:
      if (millis() - dosingTimer >= 1000) {      
        currentSystemState = TDS_INJECT_B;
        digitalWrite(PIN_RELAY_NUTRISI_B, LOW);  
        dosingTimer = millis();
      }
      break;

    case TDS_INJECT_B:
      if (millis() - dosingTimer >= 2000) {
        digitalWrite(PIN_RELAY_NUTRISI_B, HIGH); 
        currentSystemState = TUNGGU_REAKSI;
        dosingTimer = millis();
      }
      break;

    case TUNGGU_REAKSI:
      if (millis() - dosingTimer >= 10000) {     
        currentSystemState = RUNNING_NORMAL;     
      }
      break;
  }
}

void bacaSemuaSensor() {
  sensorSuhu.requestTemperatures();
  temperature = sensorSuhu.getTempCByIndex(0);

  int16_t adc_ph = ads.readADC_SingleEnded(1);
  float voltage_ph = ads.computeVolts(adc_ph);
  currentPH = (-6.33 * voltage_ph) + 23.00;
  if (currentPH < 0.0) currentPH = 0.0;
  if (currentPH > 14.0) currentPH = 14.0;

  int16_t adc_tds = ads.readADC_SingleEnded(0);
  float voltage_tds = ads.computeVolts(adc_tds);
  currentPPM = voltage_tds * 575.83; 

  Serial.print("[LOG] Suhu: "); Serial.print(temperature, 1);
  Serial.print(" C | pH: "); Serial.print(currentPH, 2);
  Serial.print(" | TDS: "); Serial.print(currentPPM, 0); Serial.println(" ppm");
}

void kelolaWaktuDanUsia() {
  if (sudahSetTanggal) {
    DateTime now = rtc.now();
    if (hariTerakhirDicek == -1) hariTerakhirDicek = now.day();
    else if (now.day() != hariTerakhirDicek) {
      usiaAktual++;
      hariTerakhirDicek = now.day(); 
    }
  }
}

void perbaruiTampilanLCD() {
  switch (currentState) {
    case MONITOR:
      lcd.setCursor(0, 0); lcd.print("PLANT:" + daftarTanaman[indeksTanaman] + "          ");
      lcd.setCursor(0, 1);
      if (sudahSetTanggal) lcd.print("UMUR : H-" + String(usiaAktual) + "    ");
      else lcd.print("UMUR : [STBY]   ");
      lcd.setCursor(14, 1); lcd.print(String(temperature, 1) + char(223) + "C ");
      lcd.setCursor(0, 2); lcd.print("PPM:" + String(currentPPM, 0) + "  pH:" + String(currentPH, 1) + "     ");
      lcd.setCursor(0, 3);
      if (!sudahSetTanggal)                          lcd.print("STAT: STANDBY WAIT  ");
      else if (currentSystemState == PH_UP_INJECT)   lcd.print("STAT: INJECT pH UP  ");
      else if (currentSystemState == TDS_INJECT_A)   lcd.print("STAT: INJECT NUT. A ");
      else if (currentSystemState == TDS_INJECT_B)   lcd.print("STAT: INJECT NUT. B ");
      else if (currentSystemState == TDS_JEDA)       lcd.print("STAT: JEDA A KE B   ");
      else if (currentSystemState == TUNGGU_REAKSI)  lcd.print("STAT: MIXING WATER  ");
      else lcd.print("STAT: RUNNING NORMAL");
      break;

    case PILIH_TANAMAN:
      lcd.setCursor(0, 0); lcd.print("=== PILIH TANAMAN ==");
      lcd.setCursor(0, 1); lcd.print("> " + daftarTanaman[indeksTanaman] + "          ");
      lcd.setCursor(0, 2); lcd.print("                    ");
      lcd.setCursor(0, 3); lcd.print("[ENTER] UNTUK LANJUT");
      break;

    case SET_USIA:
      lcd.setCursor(0, 0); lcd.print("=== SET UMUR BIBIT =");
      lcd.setCursor(0, 1); lcd.print("> UMUR: " + String(usiaAwalBibit) + " HARI    ");
      lcd.setCursor(0, 2); lcd.print("                    ");
      lcd.setCursor(0, 3); lcd.print("[ENTER] UNTUK START ");
      break;
  }
}

void bacaRotaryEncoder() {
  int currentStateCLK = digitalRead(PIN_ENCODER_CLK);
  if (currentStateCLK != lastStateCLK  && currentStateCLK == 1) {
    if (digitalRead(PIN_ENCODER_DT) != currentStateCLK) {
      if (currentState == PILIH_TANAMAN) {
        indeksTanaman++;
        if (indeksTanaman >= jumlahTanaman) indeksTanaman = 0;
      } else if (currentState == SET_USIA) usiaAwalBibit++;
    } else {
      if (currentState == PILIH_TANAMAN) {
        indeksTanaman--;
        if (indeksTanaman < 0) indeksTanaman = jumlahTanaman - 1;
      } else if (currentState == SET_USIA) {
        usiaAwalBibit--;
        if (usiaAwalBibit < 1) usiaAwalBibit = 1;
      }
    }
  }
  lastStateCLK = currentStateCLK;

  if (digitalRead(PIN_ENCODER_SW) == LOW) {
    if (millis() - lastButtonPress > 250) { 
      if (currentState == MONITOR && !sudahSetTanggal) { currentState = PILIH_TANAMAN; lcd.clear(); } 
      else if (currentState == PILIH_TANAMAN) { currentState = SET_USIA; lcd.clear(); } 
      else if (currentState == SET_USIA) {
        usiaAktual = usiaAwalBibit;
        sudahSetTanggal = true;
        currentState = MONITOR;
        currentSystemState = RUNNING_NORMAL;
        hariTerakhirDicek = rtc.now().day(); 
        lcd.clear();
      }
      lastButtonPress = millis();
    }
  }
}

void kirimDataKeWeb() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    String statusString = "RUNNING_NORMAL";
    if (currentSystemState == PH_UP_INJECT) statusString = "PH_UP_INJECT";
    else if (currentSystemState == TDS_INJECT_A) statusString = "TDS_INJECT_A";
    else if (currentSystemState == TDS_INJECT_B) statusString = "TDS_INJECT_B";
    else if (currentSystemState == TDS_JEDA) statusString = "TDS_JEDA";
    else if (currentSystemState == TUNGGU_REAKSI) statusString = "TUNGGU_REAKSI";

    String httpRequestData = "{\"suhu\":" + String(temperature, 1) + 
                             ",\"ph\":" + String(currentPH, 2) + 
                             ",\"tds\":" + String(currentPPM, 0) + 
                             ",\"usia\":" + String(usiaAktual) +
                             ",\"status\":\"" + statusString + "\"}";

    int httpResponseCode = http.POST(httpRequestData);
    Serial.print("[HTTP POST] Response: "); Serial.println(httpResponseCode);
    http.end();
  } else {
    Serial.println("[HTTP POST] Error: WiFi Disconnected");
  }
}