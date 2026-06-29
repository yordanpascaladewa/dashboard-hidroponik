#include <Arduino.h> 
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_ADS1X15.h>
#include <RTClib.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <Preferences.h>
#include <ArduinoJson.h> 

// ==========================================
// KREDENSIAL WIFI & SERVER VERCEL
// ==========================================
const char* ssid = "Sagi56A";         
const char* password = "m4rk1n05A"; 
const String serverName = "https://dashboardhidroponik-mu.vercel.app/api/telemetry";
const String serverSettings = "https://dashboardhidroponik-mu.vercel.app/api/settings";

// ==========================================
// 1. DEFINISI PIN HARDWARE ESP32
// ==========================================
#define I2C_SDA 32
#define I2C_SCL 33

#define PIN_RELAY_NUTRISI_A 26
#define PIN_RELAY_NUTRISI_B 27
#define PIN_RELAY_PH_UP     25
#define PIN_RELAY_PUMP      14
#define PIN_RELAY_LED       12
#define PIN_RELAY_FAN       13

#define PIN_ENCODER_CLK 18
#define PIN_ENCODER_DT  19
#define PIN_ENCODER_SW  23
#define PIN_SUHU_DS18B20 5
#define PIN_ANALOG_PH   34 

// ==========================================
// 2. INISIALISASI OBJEK & KALIBRASI
// ==========================================
LiquidCrystal_I2C lcd(0x27, 20, 4); 
Adafruit_ADS1115 ads; 
RTC_DS3231 rtc;
OneWire oneWire(PIN_SUHU_DS18B20);
DallasTemperature sensorSuhu(&oneWire);
Preferences memoriAlat; 

float kValueTDS = 1300.0 / 1417.0; 

// Prototype Fungsi
void bacaSemuaSensor();
void perbaruiTampilanLCD();
void bacaRotaryEncoder();
void kelolaWaktuDanUsia();
void kirimDataKeWeb();
void ambilKomandoWeb(); 
void sesuaikanTargetNutrisi(); 
void kirimSettingsKeWeb();

TaskHandle_t TaskWeb; 

// State & UI Menu
enum MenuState { MONITOR, PILIH_TANAMAN, SET_USIA };
MenuState currentState = MONITOR;

enum DosingState { RUNNING_NORMAL, PH_UP_INJECT, TDS_INJECT_A, TDS_JEDA, TDS_INJECT_B, TUNGGU_REAKSI };
DosingState currentSystemState = RUNNING_NORMAL;

String daftarTanaman[] = {"SELADA", "PAKCOY", "BAYAM", "KANGKUNG"};
int jumlahTanaman = 4;
int indeksTanaman = 0;

// Variabel Kontrol 
String stringTanamanAktif = "SELADA"; 
volatile int targetHariWeb = 30;      
volatile bool webDoserActive = false; 
volatile bool flagKirimSettings = false; 
volatile unsigned long lastLocalSettingTime = 0; 

// Variabel Waktu & Usia
bool sudahSetTanggal = false;
int usiaAwalBibit = 1;
int usiaAktual = 0;
int hariTerakhirDicek = -1; 

// Variabel Sensor
float currentPH = 0.0;
float currentPPM = 0.0;
float temperature = 0.0;

// Target Parameter Dynamic
float targetPH_Minimal = 6.0;
float targetPPM_Minimal = 800.0; 

// Timer Hardware (Core 1)
int lastStateCLK;
unsigned long lastButtonPress = 0;
unsigned long lastSensorRead = 0;
unsigned long lastLCDUpdate = 0;
unsigned long dosingTimer = 0; 

// ==========================================
// TUGAS CORE 0: INTERFASE JARINGAN & SERVER
// ==========================================
void TaskWebcode( void * pvParameters ) {
  unsigned long lastDataSent = 0; 
  unsigned long lastSettingsGet = 0; 

  for(;;) {
    if (WiFi.status() == WL_CONNECTED) {
      
      if (millis() - lastSettingsGet > 4000) {
        if (millis() - lastLocalSettingTime > 8000) { 
          ambilKomandoWeb(); // Aman, tidak ada lagi akses LCD di dalam fungsi ini
        }
        lastSettingsGet = millis();
      }

      if (sudahSetTanggal && (millis() - lastDataSent > 2000)) {
        kirimDataKeWeb();
        lastDataSent = millis();
      }

      if (flagKirimSettings) {
        kirimSettingsKeWeb();
        flagKirimSettings = false; 
      }
    }
    vTaskDelay(150 / portTICK_PERIOD_MS); 
  }
}

void setup() {
  Serial.begin(115200);
  
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

  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);
  pinMode(PIN_ANALOG_PH, INPUT);

  pinMode(PIN_RELAY_NUTRISI_A, OUTPUT);
  pinMode(PIN_RELAY_NUTRISI_B, OUTPUT);
  pinMode(PIN_RELAY_PH_UP, OUTPUT);
  pinMode(PIN_RELAY_PUMP, OUTPUT);
  pinMode(PIN_RELAY_LED, OUTPUT);
  pinMode(PIN_RELAY_FAN, OUTPUT);

  digitalWrite(PIN_RELAY_NUTRISI_A, HIGH);
  digitalWrite(PIN_RELAY_NUTRISI_B, HIGH);
  digitalWrite(PIN_RELAY_PH_UP, HIGH);
  digitalWrite(PIN_RELAY_PUMP, HIGH);
  digitalWrite(PIN_RELAY_LED, HIGH);
  digitalWrite(PIN_RELAY_FAN, HIGH);

  pinMode(PIN_ENCODER_CLK, INPUT_PULLUP);
  pinMode(PIN_ENCODER_DT, INPUT_PULLUP);
  pinMode(PIN_ENCODER_SW, INPUT_PULLUP);
  lastStateCLK = digitalRead(PIN_ENCODER_CLK);

  memoriAlat.begin("hidroponik", false); 
  sudahSetTanggal = memoriAlat.getBool("set", false);
  usiaAktual = memoriAlat.getInt("usia", 0);
  hariTerakhirDicek = memoriAlat.getInt("haricek", -1);
  indeksTanaman = memoriAlat.getInt("tanaman", 0);
  stringTanamanAktif = memoriAlat.getString("namatanaman", "SELADA");
  targetHariWeb = memoriAlat.getInt("targetHari", 30);

  sesuaikanTargetNutrisi();

  if (sudahSetTanggal == true) {
    currentState = MONITOR;
    currentSystemState = RUNNING_NORMAL;
    lcd.clear();
    delay(10); // Memberi nafas pada chip LCD
  } else {
    currentState = PILIH_TANAMAN; 
  }

  xTaskCreatePinnedToCore(TaskWebcode, "TaskWeb", 10000, NULL, 1, &TaskWeb, 0);          
}

// ==========================================
// TUGAS CORE 1: PROSES UTAMA HARDWARE & LOOP
// ==========================================
void loop() {
  bacaRotaryEncoder();

  if (millis() - lastSensorRead > 1200) {
    bacaSemuaSensor();
    lastSensorRead = millis();
  }

  if (millis() - lastLCDUpdate > 500) {
    perbaruiTampilanLCD();
    lastLCDUpdate = millis();
  }

  kelolaWaktuDanUsia();

  if (!sudahSetTanggal) {
    digitalWrite(PIN_RELAY_NUTRISI_A, HIGH);
    digitalWrite(PIN_RELAY_NUTRISI_B, HIGH);
    digitalWrite(PIN_RELAY_PH_UP, HIGH);
    return; 
  }

  if (webDoserActive) {
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
  } else {
    digitalWrite(PIN_RELAY_NUTRISI_A, HIGH);
    digitalWrite(PIN_RELAY_NUTRISI_B, HIGH);
    digitalWrite(PIN_RELAY_PH_UP, HIGH);
    currentSystemState = RUNNING_NORMAL;
  }
}

void sesuaikanTargetNutrisi() {
  if (stringTanamanAktif == "SELADA") {
    targetPH_Minimal = 5.8;
    if (usiaAktual <= 7) targetPPM_Minimal = 500.0;
    else if (usiaAktual <= 14) targetPPM_Minimal = 700.0;
    else if (usiaAktual <= 21) targetPPM_Minimal = 800.0;
    else targetPPM_Minimal = 900.0;
  }
  else if (stringTanamanAktif == "PAKCOY") {
    targetPH_Minimal = 6.0;
    if (usiaAktual <= 7) targetPPM_Minimal = 600.0;
    else if (usiaAktual <= 14) targetPPM_Minimal = 800.0;
    else if (usiaAktual <= 21) targetPPM_Minimal = 1000.0;
    else targetPPM_Minimal = 1200.0;
  }
  else if (stringTanamanAktif == "BAYAM") {
    targetPH_Minimal = 6.0;
    if (usiaAktual <= 7) targetPPM_Minimal = 500.0;
    else if (usiaAktual <= 14) targetPPM_Minimal = 800.0;
    else if (usiaAktual <= 21) targetPPM_Minimal = 1000.0;
    else targetPPM_Minimal = 1100.0;
  }
  else if (stringTanamanAktif == "KANGKUNG") {
    targetPH_Minimal = 5.5;
    if (usiaAktual <= 7) targetPPM_Minimal = 600.0;
    else if (usiaAktual <= 14) targetPPM_Minimal = 900.0;
    else if (usiaAktual <= 21) targetPPM_Minimal = 1100.0;
    else targetPPM_Minimal = 1300.0;
  }
}

void bacaSemuaSensor() {
  sensorSuhu.requestTemperatures();
  temperature = sensorSuhu.getTempCByIndex(0);

  unsigned long total_adc = 0;
  for (int i = 0; i < 60; i++) {
    total_adc += analogRead(PIN_ANALOG_PH);
    delayMicroseconds(150); 
  }
  float rerata_adc_ph = total_adc / 60.0;
  float voltage_ph = (rerata_adc_ph * 3.3) / 4095.0; 

  currentPH = (-5.70 * voltage_ph) + 21.20; 
  if (currentPH < 0.0) currentPH = 0.0;
  if (currentPH > 14.0) currentPH = 14.0;

  int16_t adc_tds = ads.readADC_SingleEnded(0);
  float voltage_tds = ads.computeVolts(adc_tds);
  float ppm_mentah = voltage_tds * 575.83; 
  currentPPM = ppm_mentah * kValueTDS; 
}

void kelolaWaktuDanUsia() {
  if (sudahSetTanggal) {
    DateTime now = rtc.now();
    if (hariTerakhirDicek == -1) hariTerakhirDicek = now.day();
    else if (now.day() != hariTerakhirDicek) {
      usiaAktual++;
      hariTerakhirDicek = now.day(); 
      memoriAlat.putInt("usia", usiaAktual);
      memoriAlat.putInt("haricek", hariTerakhirDicek);
      
      sesuaikanTargetNutrisi();
      flagKirimSettings = true; 
    }
  }
}

void perbaruiTampilanLCD() {
  switch (currentState) {
    case MONITOR:
      {
        String teksBaris1 = "PLANT:" + stringTanamanAktif;
        while(teksBaris1.length() < 20) teksBaris1 += " ";
        lcd.setCursor(0, 0); lcd.print(teksBaris1.substring(0, 20));
        
        lcd.setCursor(0, 1);
        if (sudahSetTanggal) {
          String teksUmur = "UMUR:" + String(usiaAktual) + "/" + String(targetHariWeb);
          while(teksUmur.length() < 13) teksUmur += " "; 
          lcd.print(teksUmur.substring(0, 13)); 
        } else {
          lcd.print("UMUR:[STBY]  ");
        }
        
        lcd.setCursor(13, 1); 
        lcd.print(String(temperature, 1) + char(223) + "C   ");

        lcd.setCursor(0, 2); lcd.print("PPM:" + String(currentPPM, 0) + "  pH:" + String(currentPH, 1) + "     ");
        lcd.setCursor(0, 3);
        if (!sudahSetTanggal)                          lcd.print("STAT: STANDBY WAIT  ");
        else if (!webDoserActive)                      lcd.print("STAT: DOSER OFFLINE ");
        else if (currentSystemState == PH_UP_INJECT)   lcd.print("STAT: INJECT pH UP  ");
        else if (currentSystemState == TDS_INJECT_A)   lcd.print("STAT: INJECT NUT. A ");
        else if (currentSystemState == TDS_INJECT_B)   lcd.print("STAT: INJECT NUT. B ");
        else if (currentSystemState == TDS_JEDA)       lcd.print("STAT: JEDA A KE B   ");
        else if (currentSystemState == TUNGGU_REAKSI)  lcd.print("STAT: MIXING WATER  ");
        else lcd.print("STAT: RUNNING NORMAL");
      }
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
      if (currentState == MONITOR && sudahSetTanggal) { 
        sudahSetTanggal = false;
        currentState = PILIH_TANAMAN;
        memoriAlat.putBool("set", false); 
        lcd.clear(); 
        delay(10); // Memberi nafas pada chip LCD sebelum ditimpa UI baru
      } 
      else if (currentState == PILIH_TANAMAN) { 
        stringTanamanAktif = daftarTanaman[indeksTanaman];
        currentState = SET_USIA; 
        lcd.clear(); 
        delay(10);
      } 
      else if (currentState == SET_USIA) {
        usiaAktual = usiaAwalBibit;
        sudahSetTanggal = true;
        currentState = MONITOR;
        currentSystemState = RUNNING_NORMAL;
        hariTerakhirDicek = rtc.now().day(); 
        
        sesuaikanTargetNutrisi();

        memoriAlat.putBool("set", sudahSetTanggal);
        memoriAlat.putInt("usia", usiaAktual);
        memoriAlat.putInt("haricek", hariTerakhirDicek);
        memoriAlat.putInt("tanaman", indeksTanaman);
        memoriAlat.putString("namatanaman", stringTanamanAktif);
        
        lcd.clear();
        delay(10);
        
        lastLocalSettingTime = millis(); 
        flagKirimSettings = true; 
      }
      lastButtonPress = millis();
    }
  }
}

void kirimDataKeWeb() {
  WiFiClientSecure client;
  client.setInsecure(); 
  HTTPClient http;
  http.begin(client, serverName);
  http.addHeader("Content-Type", "application/json");

  String statusString = "RUNNING_NORMAL";
  if (!webDoserActive) statusString = "DOSER_OFFLINE";
  else if (currentSystemState == PH_UP_INJECT) statusString = "PH_UP_INJECT";
  else if (currentSystemState == TDS_INJECT_A) statusString = "TDS_INJECT_A";
  else if (currentSystemState == TDS_INJECT_B) statusString = "TDS_INJECT_B";
  else if (currentSystemState == TDS_JEDA) statusString = "TDS_JEDA";
  else if (currentSystemState == TUNGGU_REAKSI) statusString = "TUNGGU_REAKSI";

  String httpRequestData = "{\"suhu\":" + String(temperature, 1) + 
                             ",\"ph\":" + String(currentPH, 2) + 
                             ",\"tds\":" + String(currentPPM, 0) + 
                             ",\"usia\":" + String(usiaAktual) +
                             ",\"status\":\"" + statusString + "\"}";

  http.POST(httpRequestData);
  http.end();
}

void ambilKomandoWeb() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure();
    HTTPClient http;
    
    String url = serverSettings + "?t=" + String(millis());
    http.begin(client, url);
    int httpResponseCode = http.GET();

    if (httpResponseCode == 200) {
      String payload = http.getString();
      JsonDocument doc; 
      DeserializationError err = deserializeJson(doc, payload);
      
      if (!err) {
        if (!doc["targetHari"].isNull()) {
          int hariBaru = doc["targetHari"].as<int>();
          if (hariBaru != targetHariWeb && hariBaru > 0) {
            targetHariWeb = hariBaru;
            memoriAlat.putInt("targetHari", (int)targetHariWeb);
            // lcd.clear(); --> SUDAH DIHAPUS PERMANEN DARI CORE 0
          }
        }

        if (!doc["targetTanaman"].isNull()) {
          String tanamanBaru = doc["targetTanaman"].as<String>();
          if (tanamanBaru != stringTanamanAktif) {
            stringTanamanAktif = tanamanBaru;
            if(stringTanamanAktif == "SELADA") indeksTanaman = 0;
            else if(stringTanamanAktif == "PAKCOY") indeksTanaman = 1;
            else if(stringTanamanAktif == "BAYAM") indeksTanaman = 2;
            else if(stringTanamanAktif == "KANGKUNG") indeksTanaman = 3;
            
            sudahSetTanggal = true;
            currentState = MONITOR;
            currentSystemState = RUNNING_NORMAL;
            
            sesuaikanTargetNutrisi();
            
            memoriAlat.putBool("set", true);
            memoriAlat.putString("namatanaman", stringTanamanAktif);
            memoriAlat.putInt("tanaman", indeksTanaman);
            // lcd.clear(); --> SUDAH DIHAPUS PERMANEN DARI CORE 0
          }
        }

        if (!doc["actuators"].isNull()) {
          bool pumpWeb = doc["actuators"]["pump"].as<bool>();
          bool ledWeb = doc["actuators"]["led"].as<bool>();
          bool fanWeb = doc["actuators"]["fan"].as<bool>();
          
          webDoserActive = doc["actuators"]["doser"].as<bool>();

          digitalWrite(PIN_RELAY_PUMP, pumpWeb ? LOW : HIGH);
          digitalWrite(PIN_RELAY_LED, ledWeb ? LOW : HIGH);
          digitalWrite(PIN_RELAY_FAN, fanWeb ? LOW : HIGH);
        }
      }
    }
    http.end();
  }
}

void kirimSettingsKeWeb() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure();
    HTTPClient http;
    
    http.begin(client, serverSettings);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"targetTanaman\":\"" + stringTanamanAktif + 
                         "\",\"targetHari\":" + String(targetHariWeb) + "}";

    http.POST(jsonPayload);
    http.end();
  }
}