#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_ADS1X15.h>
#include <RTClib.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Preferences.h> 
#include <Adafruit_INA219.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <time.h> 

// ==========================================
// 1. DEFINISI PIN HARDWARE ESP32
// ==========================================
#define I2C_SDA 21
#define I2C_SCL 22

#define PIN_RELAY_NUTRISI_A 26
#define PIN_RELAY_NUTRISI_B 27
#define PIN_RELAY_PH_UP     25

#define PIN_ENCODER_CLK 18
#define PIN_ENCODER_DT  19
#define PIN_ENCODER_SW  23

#define PIN_SUHU_DS18B20 4

// ==========================================
// KONFIGURASI WI-FI & VERCEL
// ==========================================
const char* ssid = "Sagi56A";         
const char* password = "m4rk1n05A"; 

const String serverName = "https://dashboardhidroponik-mu.vercel.app/api/telemetry"; 
const String serverCommandName = "https://dashboardhidroponik-mu.vercel.app/api/command"; 

unsigned long lastWiFiCheck = 0;
const unsigned long WIFI_CHECK_INTERVAL = 10000; 

unsigned long lastDataSent = 0;
const unsigned long DATA_SEND_INTERVAL = 10000;  

volatile bool forceDataSend = false;
String lastWebSignature = ""; // Kunci absolut untuk memblokir web usang

TaskHandle_t NetworkTaskHandle; 

// ==========================================
// 2. INISIALISASI OBJEK KOMPONEN
// ==========================================
LiquidCrystal_I2C lcd(0x27, 20, 4); 
Adafruit_ADS1115 ads; 
RTC_DS3231 rtc;
OneWire oneWire(PIN_SUHU_DS18B20);
DallasTemperature sensorSuhu(&oneWire);
Preferences preferences; 
Adafruit_INA219 ina219;

// ==========================================
// 3. KALMAN & MEDIAN FILTER
// ==========================================
struct KalmanFilter1D {
  float Q;
  float R;
  float P;
  float X;
  bool initialized;
};

void kalmanInit(KalmanFilter1D &kf, float Q, float R) {
  kf.Q = Q;
  kf.R = R;
  kf.P = 1.0;
  kf.X = 0.0;
  kf.initialized = false;
}

float kalmanUpdate(KalmanFilter1D &kf, float measurement) {
  if (!kf.initialized) {
    kf.X = measurement;
    kf.initialized = true;
    return kf.X;
  }
  kf.P = kf.P + kf.Q;
  float K = kf.P / (kf.P + kf.R);
  kf.X = kf.X + K * (measurement - kf.X);
  kf.P = (1 - K) * kf.P;
  return kf.X;
}

KalmanFilter1D kalmanPH;
KalmanFilter1D kalmanTDS;

#define MEDIAN_WINDOW 5
float medianPH[MEDIAN_WINDOW], medianTDS[MEDIAN_WINDOW];
int medianIndexPH = 0, medianIndexTDS = 0;
bool medianFilledPH = false, medianFilledTDS = false;

float hitungMedian(float* buffer, int count) {
  float temp[MEDIAN_WINDOW];
  for (int i = 0; i < count; i++) {
    temp[i] = buffer[i];
  }
  for (int i = 1; i < count; i++) {
    float key = temp[i];
    int j = i - 1;
    while (j >= 0 && temp[j] > key) {
      temp[j + 1] = temp[j];
      j--;
    }
    temp[j + 1] = key;
  }
  return temp[count / 2];
}

float filterMedianPH(float newVal) {
  medianPH[medianIndexPH] = newVal;
  medianIndexPH = (medianIndexPH + 1) % MEDIAN_WINDOW;
  if (medianIndexPH == 0) medianFilledPH = true;
  
  int count = medianFilledPH ? MEDIAN_WINDOW : medianIndexPH;
  if (count == 0) return newVal;
  return hitungMedian(medianPH, count);
}

float filterMedianTDS(float newVal) {
  medianTDS[medianIndexTDS] = newVal;
  medianIndexTDS = (medianIndexTDS + 1) % MEDIAN_WINDOW;
  if (medianIndexTDS == 0) medianFilledTDS = true;
  
  int count = medianFilledTDS ? MEDIAN_WINDOW : medianIndexTDS;
  if (count == 0) return newVal;
  return hitungMedian(medianTDS, count);
}

// ==========================================
// 4. STATE MACHINE & VARIABEL SISTEM
// ==========================================
enum Mode {
  MODE_MONITOR, 
  MODE_PILIH_TANAMAN, 
  MODE_SET_USIA,
  MODE_CAL_MENU, 
  MODE_CAL_PH_SUBMENU, 
  MODE_CAL_PH_EDIT_REF, 
  MODE_CAL_PH_SAMPLING, 
  MODE_CAL_PH_WARNING,
  MODE_CAL_TDS_SUBMENU, 
  MODE_CAL_TDS_EDIT_REF, 
  MODE_CAL_TDS_SAMPLING, 
  MODE_CAL_TDS_WARNING
};

Mode currentMode = MODE_MONITOR;

enum DosingState { 
  RUNNING_NORMAL, 
  PH_UP_INJECT, 
  TDS_INJECT_A, 
  TDS_JEDA_A_B, 
  TDS_INJECT_B, 
  TUNGGU_REAKSI 
};

DosingState currentSystemState = RUNNING_NORMAL;

// Variabel Universal Sistem
String daftarTanaman[] = {"SELADA", "SAWI", "BAYAM", "KANGKUNG", "PAKCOY", "CAISIM", "SELEDRI", "KALE", "MINT"};
int jumlahTanaman = 9;
int indeksTanaman = 0;
bool sudahSetTanggal = false;
int usiaAwalBibit = 1;
int usiaAktual = 0;
int lastDayChecked = -1; 

int durasiTampilDetik = 0; 
int durasiPompaAktif = 0; 

float currentPH = 0.0, currentPPM = 0.0, temperature = 0.0, current_mA = 0.0, current_V = 0.0; 
float voltPH = 0.0, voltTDS = 0.0;
int16_t rawADC_PH = 0, rawADC_TDS = 0;
float targetPH_Minimal = 6.0, targetPPM_Minimal = 0.0; 

float offsetSuhu = -1.6; 

int lut_pompa[5][3] = {
  {0, 0, 0},                 
  {0, 0, 0},                 
  {8000, 7000, 6000},        
  {15100, 14100, 13100},     
  {22100, 21100, 20100}      
};

float calSlopePH = -5.0, calOffsetPH = 21.34, phReferensi = 0.00;
#define MAX_PH_POINTS 10
float phPointRef[MAX_PH_POINTS], phPointVolt[MAX_PH_POINTS];
int phPointCount = 0;

float calSlopeTDS = 1000.0, calOffsetTDS = 0.0, tdsReferensi = 0.0;
#define MAX_TDS_POINTS 10
float tdsPointRef[MAX_TDS_POINTS], tdsPointVolt[MAX_TDS_POINTS];
int tdsPointCount = 0;

int calMenuIndex = 0, phSubIndex = 0, tdsSubIndex = 0;

unsigned long lastSensorRead = 0, lastLCDUpdate = 0, mixingStartTime = 0;
unsigned long actionStartTime = 0; 
const unsigned long WAKTU_JEDA_ADUK = 120000; 
unsigned long lastBlinkToggle = 0, lastEncStepTime = 0, warningStartTime = 0;
const unsigned long WARNING_DURATION_MS = 2000, BLINK_INTERVAL_MS = 150;
bool blinkState = true;

bool swLastState = HIGH;
unsigned long swPressStart = 0;
unsigned long lastBtnDebounce = 0; // Filter double-click
bool swIsPressed = false, longPressTriggered = false;
const unsigned long LONG_PRESS_MS = 2000;

// ==========================================
// 5. INTERRUPT ENCODER
// ==========================================
#define DIR_NONE   0x0
#define DIR_CW     0x10
#define DIR_CCW    0x20
#define R_START       0x0
#define R_CCW_BEGIN   0x1
#define R_CW_BEGIN    0x2
#define R_START_M     0x3
#define R_CW_BEGIN_M  0x4
#define R_CCW_BEGIN_M 0x5

const unsigned char encTransitionTable[6][4] = {
  {R_START_M,             R_CW_BEGIN,      R_CCW_BEGIN,   R_START},
  {R_START_M | DIR_CCW,   R_START,         R_CCW_BEGIN,   R_START},
  {R_START_M | DIR_CW,    R_CW_BEGIN,      R_START,       R_START},
  {R_START_M,             R_CCW_BEGIN_M,   R_CW_BEGIN_M,  R_START},
  {R_START_M,             R_START_M,       R_CW_BEGIN_M,  R_START | DIR_CW},
  {R_START_M,             R_CCW_BEGIN_M,   R_START_M,     R_START | DIR_CCW},
};

volatile uint8_t encState = R_START;
volatile int8_t encoderDelta = 0;

void IRAM_ATTR handleEncoder() {
  int clk = digitalRead(PIN_ENCODER_CLK);
  int dt  = digitalRead(PIN_ENCODER_DT);
  uint8_t pinState = (dt << 1) | clk;
  encState = encTransitionTable[encState & 0x0F][pinState];
  uint8_t dir = encState & 0x30;
  
  if (dir == DIR_CW) {
    encoderDelta++;
  } else if (dir == DIR_CCW) {
    encoderDelta--;
  }
}

// PROTOTYPE FUNGSI
void handleButton();
void bacaSemuaSensor();
void handleBlink();
void perbaruiTampilanLCD();
void sesuaikanTargetNutrisi();
void jalankanLogikaDosing();
void kirimDataKeVercel();
void ambilPerintahDariWeb();
void displayCalMenu();
void displayCalPHSubmenu();
float getStepBySpeedPH(unsigned long deltaT);
void displayCalPHSampling();
void displayWarningPH();
void displayCalTDSSubmenu();
float getStepBySpeedTDS(unsigned long deltaT);
void displayCalTDSSampling();
void displayWarningTDS();
void printMenuLine(int row, const char* label, bool selected);
void onLongPress();
void onShortPress();
void hitungKalibrasiPH();
void hitungKalibrasiTDS();
void tampilkanHasilSimpan(const char* namaSensor, float slope, float offset, int jumlahTitik);
void blinkBacklightFast(int times);

// ==========================================
// BACKGROUND TASK: CORE 0 (INTERNET & SYNC)
// ==========================================
void networkTask(void * pvParameters) {
  for (;;) {
    if (millis() - lastWiFiCheck >= WIFI_CHECK_INTERVAL) {
      lastWiFiCheck = millis();
      if (WiFi.status() != WL_CONNECTED) {
        WiFi.disconnect(); 
        WiFi.reconnect();
      }
    }

    ambilPerintahDariWeb();

    if (millis() - lastDataSent >= DATA_SEND_INTERVAL || forceDataSend) {
      forceDataSend = false; 
      lastDataSent = millis();
      kirimDataKeVercel();
    }
    
    vTaskDelay(500 / portTICK_PERIOD_MS); 
  }
}

// ==========================================
// AMBIL PERINTAH DARI WEBSITE (HTTP GET)
// ==========================================
void ambilPerintahDariWeb() {
  if (currentMode != MODE_MONITOR) return; 

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure();

    HTTPClient http;
    http.begin(client, serverCommandName);
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String payload = http.getString();
      JsonDocument doc;
      DeserializationError error = deserializeJson(doc, payload);
      
      if (!error) {
        String tanamanWeb = doc["tanaman"].as<String>();
        int umurWeb = doc["usia_hari"].as<int>();
        bool aktifWeb = doc["aktif"].as<bool>();
        
        // Identifikasi unik dari status web saat ini
        String currentWebSig = tanamanWeb + "_" + String(umurWeb) + "_" + (aktifWeb ? "1" : "0");

        // Hanya proses jika data web BERBEDA dari rekaman alat (Menghindari eksekusi ulang)
        if (currentWebSig != lastWebSignature) {
            
            // Simpan jejak web terbaru ke memori
            lastWebSignature = currentWebSig;
            preferences.putString("web_sig", lastWebSignature);

            if (aktifWeb && tanamanWeb != "") {
              int indexDitemukan = -1;
              for (int i = 0; i < jumlahTanaman; i++) {
                if (daftarTanaman[i] == tanamanWeb) {
                  indexDitemukan = i; break;
                }
              }
              if (indexDitemukan != -1) {
                indeksTanaman = indexDitemukan;
                usiaAktual = umurWeb;
                sudahSetTanggal = true;
                lastDayChecked = rtc.now().day();

                // Simpan parameter aktif ke EEPROM
                preferences.putBool("is_set", true);
                preferences.putInt("idx_tanaman", indeksTanaman);
                preferences.putInt("usia", usiaAktual);
                preferences.putInt("last_day", lastDayChecked);
              }
            } else {
              // Jika web memerintahkan alat untuk mati / standby
              sudahSetTanggal = false;
              preferences.putBool("is_set", false);
              digitalWrite(PIN_RELAY_NUTRISI_A, HIGH);
              digitalWrite(PIN_RELAY_NUTRISI_B, HIGH);
              digitalWrite(PIN_RELAY_PH_UP, HIGH);
              currentSystemState = RUNNING_NORMAL;
              forceDataSend = true;
            }
        }
      }
    }
    http.end();
  }
}

// ==========================================
// PENGIRIMAN DATA HTTP POST KE VERCEL
// ==========================================
void kirimDataKeVercel() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); 

    HTTPClient http; 
    http.begin(client, serverName); 
    http.addHeader("Content-Type", "application/json");

    String statusKomoditasWeb = sudahSetTanggal ? daftarTanaman[indeksTanaman] : "STANDBY";
    String statusUmurWeb = sudahSetTanggal ? String(usiaAktual) : "0";

    int statusRelayA  = (digitalRead(PIN_RELAY_NUTRISI_A) == LOW) ? 1 : 0;
    int statusRelayB  = (digitalRead(PIN_RELAY_NUTRISI_B) == LOW) ? 1 : 0;
    int statusRelayPh = (digitalRead(PIN_RELAY_PH_UP) == LOW) ? 1 : 0;

    String jsonPayload = "{";
    jsonPayload += "\"suhu\":" + String(temperature, 2) + ",";
    jsonPayload += "\"ph\":" + String(currentPH, 2) + ",";
    jsonPayload += "\"tds\":" + String(currentPPM, 0) + ",";
    jsonPayload += "\"voltaseBaterai\":" + String(current_V, 2) + ",";
    jsonPayload += "\"energiSolar\":" + String(current_mA, 2) + ",";
    jsonPayload += "\"usia_hari\":" + statusUmurWeb + ",";
    jsonPayload += "\"tanaman\":\"" + statusKomoditasWeb + "\",";
    jsonPayload += "\"relay_doser_a\":" + String(statusRelayA) + ",";
    jsonPayload += "\"relay_doser_b\":" + String(statusRelayB) + ",";
    jsonPayload += "\"relay_ph_up\":" + String(statusRelayPh) + ",";
    jsonPayload += "\"raw_volt_ph\":" + String(voltPH, 3) + ",";
    jsonPayload += "\"raw_volt_tds\":" + String(voltTDS, 3) + ",";
    jsonPayload += "\"raw_adc_ph\":" + String(rawADC_PH) + ",";
    jsonPayload += "\"raw_adc_tds\":" + String(rawADC_TDS);
    jsonPayload += "}";

    int httpResponseCode = http.POST(jsonPayload);
    http.end();
  }
}

// ==========================================
// SETUP
// ==========================================
void setup() {
  Wire.begin(I2C_SDA, I2C_SCL); 
  Wire.setClock(100000); 
  
  lcd.init(); 
  lcd.backlight(); 
  lcd.clear();
  lcd.setCursor(0, 0); lcd.print("SISTEM HIDROPONIK V5");
  lcd.setCursor(0, 1); lcd.print(" UNIVERSAL SYSTEM   ");
  delay(2000);

  lcd.clear(); 
  lcd.setCursor(0, 0); 
  lcd.print("MENYAMBUNG WIFI...  ");
  
  WiFi.mode(WIFI_STA); 
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) { 
    delay(500); 
    attempts++; 
  }
  
  lcd.setCursor(0, 0);
  if (WiFi.status() == WL_CONNECTED) {
    lcd.print("WIFI TERHUBUNG!     ");
    delay(1000);
    
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("SYNC WAKTU INTERNET ");
    configTime(7 * 3600, 0, "pool.ntp.org", "time.nist.gov"); 
    struct tm timeinfo;
    if (getLocalTime(&timeinfo, 5000)) { 
      rtc.begin();
      rtc.adjust(DateTime(timeinfo.tm_year + 1900, timeinfo.tm_mon + 1, timeinfo.tm_mday, timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec));
      lcd.setCursor(0, 1);
      lcd.print("SYNC WAKTU SUKSES!  ");
    } else {
      lcd.setCursor(0, 1);
      lcd.print("SYNC GAGAL (OFFLINE)");
    }
  } else {
    lcd.print("WIFI GAGAL!         ");
  }
  delay(1500); 
  lcd.clear();

  ads.begin(0x48); 
  ads.setGain(GAIN_ONE); 
  
  rtc.begin();
  if (rtc.lostPower()) {
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }

  sensorSuhu.begin(); 
  ina219.begin();

  DateTime now = rtc.now();
  preferences.begin("hydro_sys", false);
  
  // ========================================================
  // PEMULIHAN MEMORI MUTLAK (AUTO-RECOVERY EEPROM)
  // Memori indeks tanaman dan umur SELALU ditarik, tidak peduli status Standby/Aktif
  // ========================================================
  lastWebSignature = preferences.getString("web_sig", ""); 
  indeksTanaman = preferences.getInt("idx_tanaman", 0); 
  usiaAktual = preferences.getInt("usia", 1); 
  usiaAwalBibit = usiaAktual; 
  sudahSetTanggal = preferences.getBool("is_set", false); 
  lastDayChecked = preferences.getInt("last_day", now.day()); 
  
  if (preferences.isKey("ph_slope")) { 
    calSlopePH = preferences.getFloat("ph_slope", calSlopePH); 
    calOffsetPH = preferences.getFloat("ph_offset", calOffsetPH); 
  }
  if (preferences.isKey("tds_slope")) { 
    calSlopeTDS = preferences.getFloat("tds_slope", calSlopeTDS); 
    calOffsetTDS = preferences.getFloat("tds_offset", calOffsetTDS); 
  }

  pinMode(PIN_RELAY_NUTRISI_A, OUTPUT); 
  pinMode(PIN_RELAY_NUTRISI_B, OUTPUT); 
  pinMode(PIN_RELAY_PH_UP, OUTPUT);
  
  digitalWrite(PIN_RELAY_NUTRISI_A, HIGH); 
  digitalWrite(PIN_RELAY_NUTRISI_B, HIGH); 
  digitalWrite(PIN_RELAY_PH_UP, HIGH);

  pinMode(PIN_ENCODER_CLK, INPUT_PULLUP); 
  pinMode(PIN_ENCODER_DT, INPUT_PULLUP); 
  pinMode(PIN_ENCODER_SW, INPUT_PULLUP);
  
  attachInterrupt(digitalPinToInterrupt(PIN_ENCODER_CLK), handleEncoder, CHANGE);
  attachInterrupt(digitalPinToInterrupt(PIN_ENCODER_DT), handleEncoder, CHANGE);

  kalmanInit(kalmanPH, 0.001, 0.05); 
  kalmanInit(kalmanTDS, 0.001, 0.05);

  lcd.clear();

  xTaskCreatePinnedToCore(
    networkTask, 
    "NetworkTask", 
    10000, 
    NULL, 
    1, 
    &NetworkTaskHandle, 
    0
  );
}

// ==========================================
// LOOP UTAMA
// ==========================================
void loop() {
  handleButton();
  bacaSemuaSensor();
  handleBlink();

  int dir = 0;
  noInterrupts();
  // FILTER ENCODER: Wajib mengumpulkan 2 pulsa mekanis untuk 1 putaran di layar
  if (encoderDelta >= 2) { 
    dir = 1;  
    encoderDelta = 0; 
  } else if (encoderDelta <= -2) { 
    dir = -1; 
    encoderDelta = 0; 
  }
  interrupts();

  switch (currentMode) {
    case MODE_MONITOR:
      if (millis() - lastLCDUpdate > 500) { 
        perbaruiTampilanLCD(); 
        lastLCDUpdate = millis(); 
      }
      if (!sudahSetTanggal) { 
        digitalWrite(PIN_RELAY_NUTRISI_A, HIGH); 
        digitalWrite(PIN_RELAY_NUTRISI_B, HIGH); 
        digitalWrite(PIN_RELAY_PH_UP, HIGH); 
      } else { 
        sesuaikanTargetNutrisi(); 
        jalankanLogikaDosing(); 
      }
      break;

    case MODE_PILIH_TANAMAN:
      if (dir != 0) {
        indeksTanaman = (indeksTanaman + dir + jumlahTanaman) % jumlahTanaman;
      }
      lcd.setCursor(0, 0); lcd.print("=== PILIH TANAMAN ==");
      lcd.setCursor(0, 1); lcd.print("> " + daftarTanaman[indeksTanaman] + "          ");
      lcd.setCursor(0, 3); lcd.print("[ENTER] UNTUK LANJUT");
      break;

    case MODE_SET_USIA:
      if (dir != 0) { 
        usiaAwalBibit += dir; 
        if (usiaAwalBibit < 1) usiaAwalBibit = 1; 
      }
      lcd.setCursor(0, 0); lcd.print("=== SET UMUR BIBIT =");
      lcd.setCursor(0, 1); lcd.print("> UMUR: " + String(usiaAwalBibit) + " HARI    ");
      lcd.setCursor(0, 3); lcd.print("[ENTER] UNTUK START ");
      break;

    case MODE_CAL_MENU:
      if (dir != 0) { 
        calMenuIndex = (calMenuIndex + dir + 3) % 3; 
        lcd.clear(); 
      }
      displayCalMenu(); 
      break;

    case MODE_CAL_PH_SUBMENU:
      if (dir != 0) { 
        phSubIndex = (phSubIndex + dir + 3) % 3; 
        lcd.clear(); 
      }
      displayCalPHSubmenu(); 
      break;

    case MODE_CAL_PH_EDIT_REF:
      if (dir != 0) { 
        unsigned long now = millis(); 
        float step = getStepBySpeedPH(now - lastEncStepTime); 
        lastEncStepTime = now; 
        phReferensi += dir * step; 
        
        if (phReferensi < 0) phReferensi = 0; 
        if (phReferensi > 14) phReferensi = 14; 
      }
      displayCalPHSubmenu(); 
      break;

    case MODE_CAL_PH_SAMPLING: 
      displayCalPHSampling(); 
      break;

    case MODE_CAL_PH_WARNING:
      displayWarningPH(); 
      if (millis() - warningStartTime >= WARNING_DURATION_MS) { 
        currentMode = MODE_CAL_PH_SUBMENU; 
        lcd.clear(); 
      } 
      break;

    case MODE_CAL_TDS_SUBMENU:
      if (dir != 0) { 
        tdsSubIndex = (tdsSubIndex + dir + 3) % 3; 
        lcd.clear(); 
      }
      displayCalTDSSubmenu(); 
      break;

    case MODE_CAL_TDS_EDIT_REF:
      if (dir != 0) { 
        unsigned long now = millis(); 
        float step = getStepBySpeedTDS(now - lastEncStepTime); 
        lastEncStepTime = now; 
        tdsReferensi += dir * step; 
        
        if (tdsReferensi < 0) tdsReferensi = 0; 
        if (tdsReferensi > 5000) tdsReferensi = 5000; 
      }
      displayCalTDSSubmenu(); 
      break;

    case MODE_CAL_TDS_SAMPLING: 
      displayCalTDSSampling(); 
      break;

    case MODE_CAL_TDS_WARNING:
      displayWarningTDS(); 
      if (millis() - warningStartTime >= WARNING_DURATION_MS) { 
        currentMode = MODE_CAL_TDS_SUBMENU; 
        lcd.clear(); 
      } 
      break;
  }
}

// ==========================================
// TARGET NUTRISI UNIVERSAL LENGKAP
// ==========================================
void sesuaikanTargetNutrisi() {
  String tanaman = daftarTanaman[indeksTanaman];
  
  if (tanaman == "SELADA") {
    targetPH_Minimal = 5.8;
    if (usiaAktual <= 7) targetPPM_Minimal = 500.0;
    else if (usiaAktual <= 14) targetPPM_Minimal = 700.0;
    else if (usiaAktual <= 21) targetPPM_Minimal = 800.0;
    else targetPPM_Minimal = 900.0;
  }
  else if (tanaman == "SAWI") { 
    targetPH_Minimal = 6.0; 
    if (usiaAktual <= 7) targetPPM_Minimal = 600.0; 
    else if (usiaAktual <= 14) targetPPM_Minimal = 800.0; 
    else if (usiaAktual <= 21) targetPPM_Minimal = 1000.0; 
    else targetPPM_Minimal = 1200.0; 
  }
  else if (tanaman == "BAYAM") { 
    targetPH_Minimal = 6.0; 
    if (usiaAktual <= 7) targetPPM_Minimal = 500.0; 
    else if (usiaAktual <= 14) targetPPM_Minimal = 800.0; 
    else if (usiaAktual <= 21) targetPPM_Minimal = 1000.0; 
    else targetPPM_Minimal = 1100.0; 
  }
  else if (tanaman == "KANGKUNG") { 
    targetPH_Minimal = 5.5; 
    if (usiaAktual <= 7) targetPPM_Minimal = 600.0; 
    else if (usiaAktual <= 14) targetPPM_Minimal = 900.0; 
    else if (usiaAktual <= 21) targetPPM_Minimal = 1100.0; 
    else targetPPM_Minimal = 1300.0; 
  }
  else if (tanaman == "PAKCOY") { 
    targetPH_Minimal = 6.0; 
    if (usiaAktual <= 7) targetPPM_Minimal = 600.0; 
    else if (usiaAktual <= 14) targetPPM_Minimal = 850.0; 
    else if (usiaAktual <= 21) targetPPM_Minimal = 1050.0; 
    else targetPPM_Minimal = 1200.0; 
  }
  else if (tanaman == "CAISIM") { 
    targetPH_Minimal = 6.0; 
    if (usiaAktual <= 7) targetPPM_Minimal = 600.0; 
    else if (usiaAktual <= 14) targetPPM_Minimal = 850.0; 
    else if (usiaAktual <= 21) targetPPM_Minimal = 1000.0; 
    else targetPPM_Minimal = 1200.0; 
  }
  else if (tanaman == "SELEDRI") { 
    targetPH_Minimal = 6.0; 
    if (usiaAktual <= 7) targetPPM_Minimal = 600.0; 
    else if (usiaAktual <= 14) targetPPM_Minimal = 800.0; 
    else if (usiaAktual <= 21) targetPPM_Minimal = 1000.0; 
    else targetPPM_Minimal = 1200.0; 
  }
  else if (tanaman == "KALE") { 
    targetPH_Minimal = 6.0; 
    if (usiaAktual <= 7) targetPPM_Minimal = 700.0; 
    else if (usiaAktual <= 14) targetPPM_Minimal = 900.0; 
    else if (usiaAktual <= 21) targetPPM_Minimal = 1100.0; 
    else targetPPM_Minimal = 1300.0; 
  }
  else if (tanaman == "MINT") { 
    targetPH_Minimal = 6.0; 
    if (usiaAktual <= 7) targetPPM_Minimal = 600.0; 
    else if (usiaAktual <= 14) targetPPM_Minimal = 700.0; 
    else if (usiaAktual <= 21) targetPPM_Minimal = 800.0; 
    else targetPPM_Minimal = 900.0; 
  }
}

// ==========================================
// LOGIKA DOSING NON-BLOCKING
// ==========================================
void jalankanLogikaDosing() {
  if (currentSystemState == TUNGGU_REAKSI) { 
    if (millis() - mixingStartTime >= WAKTU_JEDA_ADUK) { 
      currentSystemState = RUNNING_NORMAL; 
    } 
    return; 
  }
  
  if (currentSystemState == RUNNING_NORMAL) {
    if (currentPH < targetPH_Minimal) { 
      currentSystemState = PH_UP_INJECT; 
      actionStartTime = millis(); 
      digitalWrite(PIN_RELAY_PH_UP, LOW); 
      forceDataSend = true; 
      perbaruiTampilanLCD(); 
    }
    else {
      float error_TDS = targetPPM_Minimal - currentPPM;
      if (error_TDS > 0) {
        int baris_error = 0, kolom_suhu = 0;
        
        if (error_TDS <= 50) baris_error = 1; 
        else if (error_TDS <= 150) baris_error = 2; 
        else if (error_TDS <= 250) baris_error = 3; 
        else baris_error = 4;                               
        
        if (temperature < 24.0) kolom_suhu = 0; 
        else if (temperature <= 28.0) kolom_suhu = 1; 
        else kolom_suhu = 2;
        
        durasiPompaAktif = lut_pompa[baris_error][kolom_suhu]; 
        durasiTampilDetik = durasiPompaAktif / 1000; 
        
        if (durasiPompaAktif > 0) { 
          currentSystemState = TDS_INJECT_A; 
          actionStartTime = millis(); 
          digitalWrite(PIN_RELAY_NUTRISI_A, LOW); 
          forceDataSend = true; 
          perbaruiTampilanLCD(); 
        }
      }
    }
  }
  else if (currentSystemState == PH_UP_INJECT) { 
    if (millis() - actionStartTime >= 2000) { 
      digitalWrite(PIN_RELAY_PH_UP, HIGH); 
      currentSystemState = TUNGGU_REAKSI; 
      mixingStartTime = millis(); 
      forceDataSend = true; 
      perbaruiTampilanLCD(); 
    } 
  }
  else if (currentSystemState == TDS_INJECT_A) { 
    if (millis() - actionStartTime >= durasiPompaAktif) { 
      digitalWrite(PIN_RELAY_NUTRISI_A, HIGH); 
      currentSystemState = TDS_JEDA_A_B; 
      actionStartTime = millis(); 
      forceDataSend = true; 
      perbaruiTampilanLCD(); 
    } 
  }
  else if (currentSystemState == TDS_JEDA_A_B) { 
    if (millis() - actionStartTime >= 3000) { 
      currentSystemState = TDS_INJECT_B; 
      actionStartTime = millis(); 
      digitalWrite(PIN_RELAY_NUTRISI_B, LOW); 
      forceDataSend = true; 
      perbaruiTampilanLCD(); 
    } 
  }
  else if (currentSystemState == TDS_INJECT_B) { 
    if (millis() - actionStartTime >= durasiPompaAktif) { 
      digitalWrite(PIN_RELAY_NUTRISI_B, HIGH); 
      currentSystemState = TUNGGU_REAKSI; 
      mixingStartTime = millis(); 
      forceDataSend = true; 
      perbaruiTampilanLCD(); 
    } 
  }
} 

// ==========================================
// FUNGSI PEMBACAAN TDS AKURAT
// ==========================================
float hitungTDSAkurat(float tegangan_murni, float suhu_air_mentah) {
  float suhu_air = suhu_air_mentah; 
  float ppm_mentah = 0;
  float koefisien_suhu = 1.0;

  if (suhu_air <= 0.0 || suhu_air > 60.0) {
    suhu_air = 25.0; 
  }

  if (tegangan_murni < 0.395) {
    ppm_mentah = (tegangan_murni / 0.395) * 129.0;
  } 
  else if (tegangan_murni < 0.895) {
    ppm_mentah = 129.0 + ((tegangan_murni - 0.395) / (0.895 - 0.395)) * (280.0 - 129.0);
  } 
  else if (tegangan_murni < 1.273) {
    ppm_mentah = 280.0 + ((tegangan_murni - 0.895) / (1.273 - 0.895)) * (426.0 - 280.0);
  } 
  else if (tegangan_murni < 2.012) {
    ppm_mentah = 426.0 + ((tegangan_murni - 1.273) / (2.012 - 1.273)) * (665.0 - 426.0);
  } 
  else if (tegangan_murni < 2.200) {
    ppm_mentah = 665.0 + ((tegangan_murni - 2.012) / (2.200 - 2.012)) * (1130.0 - 665.0);
  }
  else if (tegangan_murni <= 2.410) {
    ppm_mentah = 1130.0 + ((tegangan_murni - 2.200) / (2.410 - 2.200)) * (1400.0 - 1130.0);
  } 
  else {
    ppm_mentah = 1400.0;
  }

  float delta_T = suhu_air - 25.0;
  if (suhu_air >= 25.0) {
    koefisien_suhu = 1.0 + (0.02 * delta_T) + (0.0015 * delta_T * delta_T);
  } 
  else {
    koefisien_suhu = 1.0 + (0.038 * delta_T);
  }

  float ppm_hasil_sementara = ppm_mentah / koefisien_suhu;
  float ppm_final = ppm_hasil_sementara * 1.76; 

  if (ppm_final > 1500.0) ppm_final = 1500.0;

  return ppm_final;
}

// ==========================================
// PEMBACAAN SENSOR & UPDATE UMUR CERDAS
// ==========================================
void bacaSemuaSensor() {
  if (millis() - lastSensorRead < 500) return;
  lastSensorRead = millis();
  
  sensorSuhu.requestTemperatures(); 
  temperature = sensorSuhu.getTempCByIndex(0) + offsetSuhu;
  
  current_mA = abs(ina219.getCurrent_mA()); 
  current_V = ina219.getBusVoltage_V(); 
  
  delay(15); 
  rawADC_PH = ads.readADC_SingleEnded(1);
  delay(5); 
  rawADC_TDS = ads.readADC_SingleEnded(0);
  
  float rawVoltPH = ads.computeVolts(rawADC_PH); 
  float rawVoltTDS = ads.computeVolts(rawADC_TDS);
  
  float medPH = filterMedianPH(rawVoltPH); 
  float medTDS = filterMedianTDS(rawVoltTDS);
  
  voltPH = kalmanUpdate(kalmanPH, medPH); 
  voltTDS = kalmanUpdate(kalmanTDS, medTDS);
  
  currentPH = calSlopePH * voltPH + calOffsetPH; 
  if(currentPH < 0) currentPH = 0; 
  if(currentPH > 14) currentPH = 14;
  
  currentPPM = hitungTDSAkurat(voltTDS, temperature); 
  if(currentPPM < 0) currentPPM = 0;

  if (sudahSetTanggal) {
    DateTime now = rtc.now();
    if (lastDayChecked != -1 && lastDayChecked != now.day()) {
      int hariTerlewat = now.day() - lastDayChecked;
      if (hariTerlewat < 0) {
        hariTerlewat = 1; 
      }
      
      usiaAktual += hariTerlewat;
      lastDayChecked = now.day();
      
      preferences.putInt("usia", usiaAktual);
      preferences.putInt("last_day", lastDayChecked);
    }
  }
}

// ==========================================
// UI & DISPLAY MENU
// ==========================================
void perbaruiTampilanLCD() {
  char buffer[21]; 

  lcd.setCursor(0, 0); 
  String namaPlnt = daftarTanaman[indeksTanaman];
  if (namaPlnt.length() > 8) namaPlnt = namaPlnt.substring(0, 8);
  snprintf(buffer, sizeof(buffer), "PLNT:%-8sI:%3.0fmA", namaPlnt.c_str(), current_mA);
  lcd.print(buffer);
  
  lcd.setCursor(0, 1); 
  if (sudahSetTanggal) {
    snprintf(buffer, sizeof(buffer), "UMUR: H-%-2d TGT:%4.0f ", usiaAktual, targetPPM_Minimal);
  } else {
    snprintf(buffer, sizeof(buffer), "UMUR: [STBY]        ");
  }
  lcd.print(buffer);
  
  lcd.setCursor(0, 2); 
  snprintf(buffer, sizeof(buffer), "PPM:%4.0f  pH:%4.1f   ", currentPPM, currentPH);
  lcd.print(buffer);
  
  lcd.setCursor(0, 3);
  if (!sudahSetTanggal) {
    snprintf(buffer, sizeof(buffer), "STAT: STANDBY       ");
  }
  else if (currentSystemState == PH_UP_INJECT) { 
    int sisa = 2 - ((millis() - actionStartTime)/1000); 
    snprintf(buffer, sizeof(buffer), "STAT: INJ pH UP (%ds) ", sisa); 
  }
  else if (currentSystemState == TDS_INJECT_A) { 
    int sisa = (durasiPompaAktif - (millis() - actionStartTime))/1000; 
    snprintf(buffer, sizeof(buffer), "STAT: INJ. A (%ds)   ", sisa); 
  }
  else if (currentSystemState == TDS_JEDA_A_B) { 
    int sisa = 3 - ((millis() - actionStartTime)/1000); 
    snprintf(buffer, sizeof(buffer), "STAT: JEDA (%ds)     ", sisa); 
  }
  else if (currentSystemState == TDS_INJECT_B) { 
    int sisa = (durasiPompaAktif - (millis() - actionStartTime))/1000; 
    snprintf(buffer, sizeof(buffer), "STAT: INJ. B (%ds)   ", sisa); 
  }
  else if (currentSystemState == TUNGGU_REAKSI) { 
    int sisaWaktu = (WAKTU_JEDA_ADUK - (millis() - mixingStartTime)) / 1000; 
    snprintf(buffer, sizeof(buffer), "STAT: ADUK (%ds)     ", sisaWaktu); 
  } 
  else {
    snprintf(buffer, sizeof(buffer), "STAT: RUNNING NORMAL");
  }
  lcd.print(buffer);
}

void displayCalMenu() { 
  lcd.setCursor(0, 0); 
  lcd.print("    KALIBRASI      "); 
  printMenuLine(1, "PH", calMenuIndex == 0); 
  printMenuLine(2, "TDS", calMenuIndex == 1); 
  printMenuLine(3, "SUHU", calMenuIndex == 2); 
}

void printMenuLine(int row, const char* label, bool selected) { 
  lcd.setCursor(0, row); 
  if (selected) {
    lcd.print(blinkState ? ">>  " : "    "); 
  } else {
    lcd.print("    "); 
  }
  lcd.print(label); 
  int used = 4 + strlen(label); 
  for (int i = used; i < 20; i++) lcd.print(" "); 
}

void displayCalPHSubmenu() { 
  lcd.setCursor(0, 0); 
  lcd.print("  KALIBRASI pH     "); 
  lcd.setCursor(0, 1); 
  bool isEditing = (currentMode == MODE_CAL_PH_EDIT_REF); 
  
  if (phSubIndex == 0) {
    lcd.print(isEditing ? ">>  " : (blinkState ? ">>  " : "    ")); 
  } else {
    lcd.print("    "); 
  }
  
  char bufRef[17]; 
  snprintf(bufRef, sizeof(bufRef), "Set Ref   [%.2f]", phReferensi); 
  lcd.print(bufRef); 
  printMenuLine(2, "START", phSubIndex == 1); 
  printMenuLine(3, "SAVE", phSubIndex == 2); 
}

void displayCalPHSampling() { 
  lcd.setCursor(0, 0); 
  lcd.print("  KALIBRASI pH     "); 
  lcd.setCursor(0, 1); 
  lcd.print("Celupkan Probe pH   "); 
  lcd.setCursor(0, 2); 
  
  char line[21]; 
  snprintf(line, sizeof(line), "TERBACA:   [%.3f V]", voltPH); 
  lcd.print(line); 
  
  lcd.setCursor(0, 3); 
  lcd.print("CLICK to SAMPLING   "); 
}

void displayWarningPH() { 
  lcd.setCursor(0, 0); 
  lcd.print("    PERINGATAN     "); 
  lcd.setCursor(0, 1); 
  lcd.print("Tidak bisa di save  "); 
  lcd.setCursor(0, 2); 
  
  char l[21]; 
  snprintf(l, sizeof(l), "hanya %d sampel      ", phPointCount); 
  lcd.print(l); 
  
  lcd.setCursor(0, 3); 
  lcd.print("Minimal 2 sampel    "); 
}

void displayCalTDSSubmenu() { 
  lcd.setCursor(0, 0); 
  lcd.print("  KALIBRASI TDS    "); 
  lcd.setCursor(0, 1); 
  bool isEditing = (currentMode == MODE_CAL_TDS_EDIT_REF); 
  
  if (tdsSubIndex == 0) {
    lcd.print(isEditing ? ">>  " : (blinkState ? ">>  " : "    ")); 
  } else {
    lcd.print("    "); 
  }
  
  char bufRef[17]; 
  snprintf(bufRef, sizeof(bufRef), "Set Ref  [%4d]", (int)tdsReferensi); 
  lcd.print(bufRef); 
  lcd.print("  "); 
  
  printMenuLine(2, "START", tdsSubIndex == 1); 
  printMenuLine(3, "SAVE", tdsSubIndex == 2); 
}

void displayCalTDSSampling() { 
  lcd.setCursor(0, 0); 
  lcd.print("  KALIBRASI TDS    "); 
  lcd.setCursor(0, 1); 
  lcd.print("Celupkan Probe TDS  "); 
  lcd.setCursor(0, 2); 
  
  char line[21]; 
  snprintf(line, sizeof(line), "TERBACA:   [%.3f V]", voltTDS); 
  lcd.print(line); 
  
  lcd.setCursor(0, 3); 
  lcd.print("CLICK to SAMPLING   "); 
}

void displayWarningTDS() { 
  lcd.setCursor(0, 0); 
  lcd.print("    PERINGATAN     "); 
  lcd.setCursor(0, 1); 
  lcd.print("Tidak bisa di save  "); 
  lcd.setCursor(0, 2); 
  
  char l[21]; 
  snprintf(l, sizeof(l), "hanya %d sampel      ", tdsPointCount); 
  lcd.print(l); 
  
  lcd.setCursor(0, 3); 
  lcd.print("Minimal 2 sampel    "); 
}

// ==========================================
// HANDLING TOMBOL ENCODER DENGAN DEBOUNCE
// ==========================================
void handleButton() {
  bool swState = digitalRead(PIN_ENCODER_SW);
  
  // Anti-Bouncing: delay 50ms untuk menghilangkan 'double-click'
  if (swState == LOW && swLastState == HIGH && (millis() - lastBtnDebounce > 50)) { 
    lastBtnDebounce = millis();
    swPressStart = millis(); 
    swIsPressed = true; 
    longPressTriggered = false; 
  }
  
  if (swState == LOW && swIsPressed && !longPressTriggered) { 
    if (millis() - swPressStart >= LONG_PRESS_MS) { 
      longPressTriggered = true; 
      onLongPress(); 
    } 
  }
  
  if (swState == HIGH && swLastState == LOW && (millis() - lastBtnDebounce > 50)) { 
    lastBtnDebounce = millis();
    if (!longPressTriggered && swIsPressed) {
      onShortPress(); 
    }
    swIsPressed = false; 
  }
  
  swLastState = swState;
}

void onShortPress() {
  if (currentMode == MODE_CAL_PH_WARNING || currentMode == MODE_CAL_TDS_WARNING) return;
  
  switch (currentMode) {
    case MODE_MONITOR: 
      if (!sudahSetTanggal) { 
        currentMode = MODE_PILIH_TANAMAN; 
        lcd.clear(); 
      } 
      break;
      
    case MODE_PILIH_TANAMAN: 
      currentMode = MODE_SET_USIA; 
      
      // Simpan langsung memori tanaman saat terpilih
      preferences.putInt("idx_tanaman", indeksTanaman);
      
      lcd.clear(); 
      break;
      
    case MODE_SET_USIA: 
      usiaAktual = usiaAwalBibit; 
      sudahSetTanggal = true; 
      lastDayChecked = rtc.now().day();
      
      preferences.putBool("is_set", true); 
      preferences.putInt("idx_tanaman", indeksTanaman); 
      preferences.putInt("usia", usiaAktual); 
      preferences.putInt("last_day", lastDayChecked);
      
      currentMode = MODE_MONITOR; 
      lcd.clear(); 
      break;
      
    case MODE_CAL_MENU: 
      if (calMenuIndex == 0) { 
        phPointCount = 0; 
        phSubIndex = 0; 
        currentMode = MODE_CAL_PH_SUBMENU; 
        lcd.clear(); 
      } 
      else if (calMenuIndex == 1) { 
        tdsPointCount = 0; 
        tdsSubIndex = 0; 
        currentMode = MODE_CAL_TDS_SUBMENU; 
        lcd.clear(); 
      } 
      break;
      
    case MODE_CAL_PH_SUBMENU:
      if (phSubIndex == 0) { 
        currentMode = MODE_CAL_PH_EDIT_REF; 
        lastEncStepTime = millis(); 
      }
      else if (phSubIndex == 1) { 
        currentMode = MODE_CAL_PH_SAMPLING; 
        lcd.clear(); 
      }
      else if (phSubIndex == 2) { 
        if (phPointCount < 2) { 
          currentMode = MODE_CAL_PH_WARNING; 
          warningStartTime = millis(); 
          lcd.clear(); 
        } else { 
          hitungKalibrasiPH(); 
          tampilkanHasilSimpan("pH", calSlopePH, calOffsetPH, phPointCount); 
          currentMode = MODE_MONITOR; 
          lcd.clear(); 
        } 
      } 
      break;
      
    case MODE_CAL_PH_EDIT_REF: 
      currentMode = MODE_CAL_PH_SUBMENU; 
      break;
      
    case MODE_CAL_PH_SAMPLING: 
      if (phPointCount < MAX_PH_POINTS) { 
        phPointRef[phPointCount] = phReferensi; 
        phPointVolt[phPointCount] = voltPH; 
        phPointCount++; 
      } 
      currentMode = MODE_CAL_PH_SUBMENU; 
      lcd.clear(); 
      break;
      
    case MODE_CAL_TDS_SUBMENU:
      if (tdsSubIndex == 0) { 
        currentMode = MODE_CAL_TDS_EDIT_REF; 
        lastEncStepTime = millis(); 
      }
      else if (tdsSubIndex == 1) { 
        currentMode = MODE_CAL_TDS_SAMPLING; 
        lcd.clear(); 
      }
      else if (tdsSubIndex == 2) { 
        if (tdsPointCount < 2) { 
          currentMode = MODE_CAL_TDS_WARNING; 
          warningStartTime = millis(); 
          lcd.clear(); 
        } else { 
          hitungKalibrasiTDS(); 
          tampilkanHasilSimpan("TDS", calSlopeTDS, calOffsetTDS, tdsPointCount); 
          currentMode = MODE_MONITOR; 
          lcd.clear(); 
        } 
      } 
      break;
      
    case MODE_CAL_TDS_EDIT_REF: 
      currentMode = MODE_CAL_TDS_SUBMENU; 
      break;
      
    case MODE_CAL_TDS_SAMPLING: 
      if (tdsPointCount < MAX_TDS_POINTS) { 
        tdsPointRef[tdsPointCount] = tdsReferensi; 
        tdsPointVolt[tdsPointCount] = voltTDS; 
        tdsPointCount++; 
      } 
      currentMode = MODE_CAL_TDS_SUBMENU; 
      lcd.clear(); 
      break;
  }
}

void onLongPress() {
  if (currentMode == MODE_MONITOR) {
    if (sudahSetTanggal) { 
      // FUNGSI ABSOLUTE STANDBY
      sudahSetTanggal = false; 
      preferences.putBool("is_set", false); 
      digitalWrite(PIN_RELAY_NUTRISI_A, HIGH); 
      digitalWrite(PIN_RELAY_NUTRISI_B, HIGH); 
      digitalWrite(PIN_RELAY_PH_UP, HIGH); 
      currentSystemState = RUNNING_NORMAL; 
      forceDataSend = true; 
      
      lcd.clear(); 
      lcd.setCursor(0,1); 
      lcd.print("   SISTEM DI-RESET  "); 
      lcd.setCursor(0,2); 
      lcd.print(" KEMBALI KE STANDBY "); 
      delay(2000); 
      lcd.clear(); 
    } 
    else { 
      currentMode = MODE_CAL_MENU; 
      calMenuIndex = 0; 
      lcd.clear(); 
    }
  } else { 
    currentMode = MODE_MONITOR; 
    lcd.clear(); 
  }
}

// ==========================================
// KALKULASI REGRESI LINEAR
// ==========================================
void hitungKalibrasiPH() {
  if (phPointCount < 2) return; 
  
  float sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0; 
  int n = phPointCount;
  
  for (int i = 0; i < n; i++) { 
    float x = phPointVolt[i];
    float y = phPointRef[i]; 
    sumX += x; 
    sumY += y; 
    sumXY += x * y; 
    sumX2 += x * x; 
  }
  
  float denom = (n * sumX2 - sumX * sumX); 
  if (abs(denom) < 0.0001) return;
  
  calSlopePH = (n * sumXY - sumX * sumY) / denom; 
  calOffsetPH = (sumY - calSlopePH * sumX) / n;
  
  preferences.putFloat("ph_slope", calSlopePH); 
  preferences.putFloat("ph_offset", calOffsetPH);
}

void hitungKalibrasiTDS() {
  if (tdsPointCount < 2) return; 
  
  float sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0; 
  int n = tdsPointCount;
  
  for (int i = 0; i < n; i++) { 
    float x = tdsPointVolt[i];
    float y = tdsPointRef[i]; 
    sumX += x; 
    sumY += y; 
    sumXY += x * y; 
    sumX2 += x * x; 
  }
  
  float denom = (n * sumX2 - sumX * sumX); 
  if (abs(denom) < 0.0001) return;
  
  calSlopeTDS = (n * sumXY - sumX * sumY) / denom; 
  calOffsetTDS = (sumY - calSlopeTDS * sumX) / n;
  
  preferences.putFloat("tds_slope", calSlopeTDS); 
  preferences.putFloat("tds_offset", calOffsetTDS);
}

// ==========================================
// UTILITIES
// ==========================================
void handleBlink() { 
  if (millis() - lastBlinkToggle >= BLINK_INTERVAL_MS) { 
    lastBlinkToggle = millis(); 
    blinkState = !blinkState; 
  } 
}

float getStepBySpeedPH(unsigned long deltaT) { 
  if (deltaT < 30) return 1.0; 
  if (deltaT < 80) return 0.5; 
  if (deltaT < 150) return 0.1; 
  return 0.01; 
}

float getStepBySpeedTDS(unsigned long deltaT) { 
  if (deltaT < 30) return 100.0; 
  if (deltaT < 80) return 50.0; 
  if (deltaT < 150) return 10.0; 
  return 1.0; 
}

void blinkBacklightFast(int times) { 
  for (int i = 0; i < times; i++) { 
    lcd.noBacklight(); 
    delay(100); 
    lcd.backlight(); 
    delay(100); 
  } 
}

void tampilkanHasilSimpan(const char* namaSensor, float slope, float offset, int jumlahTitik) { 
  lcd.clear(); 
  lcd.setCursor(0, 0); 
  
  char l0[21], l1[21], l2[21], l3[21]; 
  snprintf(l0, sizeof(l0), " Kalibrasi %s Disimpan", namaSensor); 
  lcd.print(l0); 
  
  lcd.setCursor(0, 1); 
  snprintf(l1, sizeof(l1), "Slope : %.3f", slope); 
  lcd.print(l1); 
  
  lcd.setCursor(0, 2); 
  snprintf(l2, sizeof(l2), "Offset: %.3f", offset); 
  lcd.print(l2); 
  
  lcd.setCursor(0, 3); 
  snprintf(l3, sizeof(l3), "Titik data: %d", jumlahTitik); 
  lcd.print(l3); 
  
  blinkBacklightFast(3); 
  delay(2000); 
}