#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_ADS1X15.h>
#include <RTClib.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Preferences.h> 
#include <Adafruit_INA219.h>

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

#define PIN_SUHU_DS18B20 5

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
  float Q; float R; float P; float X; bool initialized;
};

void kalmanInit(KalmanFilter1D &kf, float Q, float R) {
  kf.Q = Q; kf.R = R; kf.P = 1.0; kf.X = 0.0; kf.initialized = false;
}

float kalmanUpdate(KalmanFilter1D &kf, float measurement) {
  if (!kf.initialized) { kf.X = measurement; kf.initialized = true; return kf.X; }
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
  for (int i = 0; i < count; i++) temp[i] = buffer[i];
  for (int i = 1; i < count; i++) {
    float key = temp[i]; int j = i - 1;
    while (j >= 0 && temp[j] > key) { temp[j + 1] = temp[j]; j--; }
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
  MODE_MONITOR, MODE_PILIH_TANAMAN, MODE_SET_USIA,
  MODE_CAL_MENU, MODE_CAL_PH_SUBMENU, MODE_CAL_PH_EDIT_REF, MODE_CAL_PH_SAMPLING, MODE_CAL_PH_WARNING,
  MODE_CAL_TDS_SUBMENU, MODE_CAL_TDS_EDIT_REF, MODE_CAL_TDS_SAMPLING, MODE_CAL_TDS_WARNING
};
Mode currentMode = MODE_MONITOR;

enum DosingState { RUNNING_NORMAL, PH_UP_INJECT, TDS_INJECT_A, TDS_INJECT_B, TUNGGU_REAKSI };
DosingState currentSystemState = RUNNING_NORMAL;

// Variabel Universal Sistem
String daftarTanaman[] = {"SELADA", "SAWI", "BAYAM", "KANGKUNG", "PAKCOY", "CAISIM", "SELEDRI", "KALE", "MINT"};
int jumlahTanaman = 9;
int indeksTanaman = 0;
bool sudahSetTanggal = false;
int usiaAwalBibit = 1;
int usiaAktual = 0;
int durasiTampilDetik = 0; 

float currentPH = 0.0, currentPPM = 0.0, temperature = 0.0, current_mA = 0.0;
float current_V = 0.0; // Variabel tegangan power

float voltPH = 0.0, voltTDS = 0.0;
float targetPH_Minimal = 6.0, targetPPM_Minimal = 0.0; 

// Universal Lookup Table (lut_pompa)
int lut_pompa[5][3] = {
  {0, 0, 0},                 
  {0, 0, 0},                 
  {8000, 7000, 6000},        
  {15100, 14100, 13100},     
  {22100, 21100, 20100}      
};

// Variabel Kalibrasi
float calSlopePH = -5.0, calOffsetPH = 21.34, phReferensi = 0.00;
#define MAX_PH_POINTS 10
float phPointRef[MAX_PH_POINTS], phPointVolt[MAX_PH_POINTS];
int phPointCount = 0;

float calSlopeTDS = 1000.0, calOffsetTDS = 0.0, tdsReferensi = 0.0;
#define MAX_TDS_POINTS 10
float tdsPointRef[MAX_TDS_POINTS], tdsPointVolt[MAX_TDS_POINTS];
int tdsPointCount = 0;

int calMenuIndex = 0, phSubIndex = 0, tdsSubIndex = 0;

// Waktu & Tombol
unsigned long lastSensorRead = 0, lastLCDUpdate = 0, mixingStartTime = 0;
const unsigned long WAKTU_JEDA_ADUK = 120000; 
unsigned long lastBlinkToggle = 0, lastEncStepTime = 0, warningStartTime = 0;
const unsigned long WARNING_DURATION_MS = 2000, BLINK_INTERVAL_MS = 150;
bool blinkState = true;

bool swLastState = HIGH;
unsigned long swPressStart = 0;
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
  if (dir == DIR_CW)       encoderDelta++;
  else if (dir == DIR_CCW) encoderDelta--;
}

// ==========================================
// --- DEKLARASI FUNGSI / PROTOTYPE ---
// ==========================================
void handleButton();
void bacaSemuaSensor();
void handleBlink();
void perbaruiTampilanLCD();
void sesuaikanTargetNutrisi();
void jalankanLogikaDosing();
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
// SETUP
// ==========================================
void setup() {
  Serial.begin(115200);
  
  Wire.begin(I2C_SDA, I2C_SCL); 
  Wire.setClock(100000); // Stabilisasi kecepatan I2C ke 100kHz untuk mencegah hang
  
  lcd.init(); lcd.backlight(); lcd.clear();
  lcd.setCursor(0, 0); lcd.print("SISTEM HIDROPONIK V5");
  lcd.setCursor(0, 1); lcd.print(" UNIVERSAL SYSTEM   ");
  delay(2000);

  ads.begin(0x48); 
  ads.setGain(GAIN_ONE); 
  
  rtc.begin();
  sensorSuhu.begin();
  
  if (!ina219.begin()) {
    Serial.println("Gagal menemukan chip INA219!");
  }

  pinMode(PIN_RELAY_NUTRISI_A, OUTPUT); pinMode(PIN_RELAY_NUTRISI_B, OUTPUT); pinMode(PIN_RELAY_PH_UP, OUTPUT);
  digitalWrite(PIN_RELAY_NUTRISI_A, HIGH); digitalWrite(PIN_RELAY_NUTRISI_B, HIGH); digitalWrite(PIN_RELAY_PH_UP, HIGH);

  pinMode(PIN_ENCODER_CLK, INPUT_PULLUP); pinMode(PIN_ENCODER_DT, INPUT_PULLUP); pinMode(PIN_ENCODER_SW, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PIN_ENCODER_CLK), handleEncoder, CHANGE);
  attachInterrupt(digitalPinToInterrupt(PIN_ENCODER_DT), handleEncoder, CHANGE);

  kalmanInit(kalmanPH, 0.001, 0.05); kalmanInit(kalmanTDS, 0.001, 0.05);

  preferences.begin("hydro_sys", false);
  sudahSetTanggal = preferences.getBool("is_set", false);
  if (sudahSetTanggal) {
    indeksTanaman = preferences.getInt("idx_tanaman", 0);
    usiaAktual = preferences.getInt("usia", 1);
    usiaAwalBibit = usiaAktual; 
  }
  
  if (preferences.isKey("ph_slope")) {
    calSlopePH = preferences.getFloat("ph_slope", calSlopePH);
    calOffsetPH = preferences.getFloat("ph_offset", calOffsetPH);
  }
  if (preferences.isKey("tds_slope")) {
    calSlopeTDS = preferences.getFloat("tds_slope", calSlopeTDS);
    calOffsetTDS = preferences.getFloat("tds_offset", calOffsetTDS);
  }
  lcd.clear();
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
  if (encoderDelta >= 1) { dir = 1; encoderDelta = 0; }
  else if (encoderDelta <= -1) { dir = -1; encoderDelta = 0; }
  interrupts();

  switch (currentMode) {
    case MODE_MONITOR:
      if (millis() - lastLCDUpdate > 500) {
        perbaruiTampilanLCD();
        lastLCDUpdate = millis();
      }
      if (!sudahSetTanggal) {
        digitalWrite(PIN_RELAY_NUTRISI_A, HIGH); digitalWrite(PIN_RELAY_NUTRISI_B, HIGH); digitalWrite(PIN_RELAY_PH_UP, HIGH);
      } else {
        sesuaikanTargetNutrisi();
        jalankanLogikaDosing();
      }
      break;

    case MODE_PILIH_TANAMAN:
      if (dir != 0) indeksTanaman = (indeksTanaman - dir + jumlahTanaman) % jumlahTanaman;
      lcd.setCursor(0, 0); lcd.print("=== PILIH TANAMAN ==");
      lcd.setCursor(0, 1); lcd.print("> " + daftarTanaman[indeksTanaman] + "          ");
      lcd.setCursor(0, 2); lcd.print("                    ");
      lcd.setCursor(0, 3); lcd.print("[ENTER] UNTUK LANJUT");
      break;

    case MODE_SET_USIA:
      if (dir != 0) { usiaAwalBibit += -dir; if (usiaAwalBibit < 1) usiaAwalBibit = 1; }
      lcd.setCursor(0, 0); lcd.print("=== SET UMUR BIBIT =");
      lcd.setCursor(0, 1); lcd.print("> UMUR: " + String(usiaAwalBibit) + " HARI    ");
      lcd.setCursor(0, 2); lcd.print("                    ");
      lcd.setCursor(0, 3); lcd.print("[ENTER] UNTUK START ");
      break;

    case MODE_CAL_MENU:
      if (dir != 0) { calMenuIndex = (calMenuIndex - dir + 3) % 3; lcd.clear(); }
      displayCalMenu(); break;

    case MODE_CAL_PH_SUBMENU:
      if (dir != 0) { phSubIndex = (phSubIndex - dir + 3) % 3; lcd.clear(); }
      displayCalPHSubmenu(); break;

    case MODE_CAL_PH_EDIT_REF:
      if (dir != 0) {
        unsigned long now = millis(); float step = getStepBySpeedPH(now - lastEncStepTime);
        lastEncStepTime = now; phReferensi += (-dir) * step;
        if (phReferensi < 0) phReferensi = 0; if (phReferensi > 14) phReferensi = 14;
      }
      displayCalPHSubmenu(); break;

    case MODE_CAL_PH_SAMPLING: displayCalPHSampling(); break;

    case MODE_CAL_PH_WARNING:
      displayWarningPH();
      if (millis() - warningStartTime >= WARNING_DURATION_MS) { currentMode = MODE_CAL_PH_SUBMENU; lcd.clear(); }
      break;

    case MODE_CAL_TDS_SUBMENU:
      if (dir != 0) { tdsSubIndex = (tdsSubIndex - dir + 3) % 3; lcd.clear(); }
      displayCalTDSSubmenu(); break;

    case MODE_CAL_TDS_EDIT_REF:
      if (dir != 0) {
        unsigned long now = millis(); float step = getStepBySpeedTDS(now - lastEncStepTime);
        lastEncStepTime = now; tdsReferensi += (-dir) * step;
        if (tdsReferensi < 0) tdsReferensi = 0; if (tdsReferensi > 5000) tdsReferensi = 5000;
      }
      displayCalTDSSubmenu(); break;

    case MODE_CAL_TDS_SAMPLING: displayCalTDSSampling(); break;

    case MODE_CAL_TDS_WARNING:
      displayWarningTDS();
      if (millis() - warningStartTime >= WARNING_DURATION_MS) { currentMode = MODE_CAL_TDS_SUBMENU; lcd.clear(); }
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
// LOGIKA DOSING HIDROPONIK
// ==========================================
void jalankanLogikaDosing() {
  if (currentSystemState == TUNGGU_REAKSI) {
    if (millis() - mixingStartTime >= WAKTU_JEDA_ADUK) {
      currentSystemState = RUNNING_NORMAL;
    }
    return; 
  }

  if (currentPH < targetPH_Minimal && currentSystemState == RUNNING_NORMAL) {
    currentSystemState = PH_UP_INJECT; perbaruiTampilanLCD(); 
    digitalWrite(PIN_RELAY_PH_UP, LOW); delay(2000); digitalWrite(PIN_RELAY_PH_UP, HIGH); 
    currentSystemState = TUNGGU_REAKSI; mixingStartTime = millis(); perbaruiTampilanLCD();
  }
  else if (currentSystemState == RUNNING_NORMAL) {
    float error_TDS = targetPPM_Minimal - currentPPM;
    int baris_error = 0, kolom_suhu = 0;

    if (error_TDS <= 0) baris_error = 0;                                
    else if (error_TDS > 0 && error_TDS <= 50) baris_error = 1;          
    else if (error_TDS > 50 && error_TDS <= 150) baris_error = 2;        
    else if (error_TDS > 150 && error_TDS <= 250) baris_error = 3;       
    else baris_error = 4;                                                

    if (temperature < 24.0) kolom_suhu = 0;
    else if (temperature >= 24.0 && temperature <= 28.0) kolom_suhu = 1;
    else kolom_suhu = 2;

    int durasiPompa = lut_pompa[baris_error][kolom_suhu];
    durasiTampilDetik = durasiPompa / 1000; 

    if (durasiPompa > 0) {
      currentSystemState = TDS_INJECT_A; perbaruiTampilanLCD();
      digitalWrite(PIN_RELAY_NUTRISI_A, LOW); delay(durasiPompa); digitalWrite(PIN_RELAY_NUTRISI_A, HIGH);
      delay(3000); 
      currentSystemState = TDS_INJECT_B; perbaruiTampilanLCD();
      digitalWrite(PIN_RELAY_NUTRISI_B, LOW); delay(durasiPompa); digitalWrite(PIN_RELAY_NUTRISI_B, HIGH);
      
      currentSystemState = TUNGGU_REAKSI; mixingStartTime = millis(); perbaruiTampilanLCD();
    }
  }
}

// ==========================================
// PEMBACAAN SENSOR 
// ==========================================
void bacaSemuaSensor() {
  if (millis() - lastSensorRead < 500) return;
  lastSensorRead = millis();

  sensorSuhu.requestTemperatures();
  temperature = sensorSuhu.getTempCByIndex(0);
  
  // Membaca arus dan tegangan dari INA219
  current_mA = abs(ina219.getCurrent_mA());
  current_V = ina219.getBusVoltage_V(); 

  // [UPDATE] Tampil ke Serial Monitor TANPA WAKTU (MS)
  Serial.print("Tegangan: "); Serial.print(current_V, 2);
  Serial.print(" V \t|\t Arus: "); Serial.print(current_mA, 2);
  Serial.println(" mA");

  delay(15); // Jeda napas I2C untuk cegah tabrakan data INA219 dan ADS1115

  int16_t rawPH  = ads.readADC_SingleEnded(1);
  delay(5);  // Jeda napas antar ADC
  int16_t rawTDS = ads.readADC_SingleEnded(0);

  float rawVoltPH  = ads.computeVolts(rawPH);
  float rawVoltTDS = ads.computeVolts(rawTDS);

  float medPH  = filterMedianPH(rawVoltPH);
  float medTDS = filterMedianTDS(rawVoltTDS);
  voltPH  = kalmanUpdate(kalmanPH, medPH);
  voltTDS = kalmanUpdate(kalmanTDS, medTDS);

  currentPH  = calSlopePH * voltPH + calOffsetPH;
  if(currentPH < 0) currentPH = 0; if(currentPH > 14) currentPH = 14;
  
  currentPPM = calSlopeTDS * voltTDS + calOffsetTDS;
  if(currentPPM < 0) currentPPM = 0;
}

// ==========================================
// UI & DISPLAY MENU
// ==========================================
void perbaruiTampilanLCD() {
  lcd.setCursor(0, 0); 
  String txtArus = " I:" + String(current_mA, 0) + "mA"; 
  String txtBaris0 = "PLNT:" + daftarTanaman[indeksTanaman];
  while(txtBaris0.length() + txtArus.length() < 20) txtBaris0 += " ";
  if(txtBaris0.length() + txtArus.length() > 20) txtBaris0 = txtBaris0.substring(0, 20 - txtArus.length());
  lcd.print(txtBaris0 + txtArus);
  
  lcd.setCursor(0, 1);
  if (sudahSetTanggal) lcd.print("UMUR: H-" + String(usiaAktual) + " TGT:" + String(targetPPM_Minimal, 0) + " ");
  else lcd.print("UMUR: [STBY]        ");
  
  lcd.setCursor(0, 2);
  lcd.print("PPM:" + String(currentPPM, 0) + "  pH:" + String(currentPH, 1) + "     ");
  
  lcd.setCursor(0, 3);
  if (!sudahSetTanggal) lcd.print("STAT: STANDBY WAIT  ");
  else if (currentSystemState == PH_UP_INJECT) lcd.print("STAT: INJECT pH UP  ");
  else if (currentSystemState == TDS_INJECT_A) lcd.print("STAT: INJ. A (" + String(durasiTampilDetik) + "s)  ");
  else if (currentSystemState == TDS_INJECT_B) lcd.print("STAT: INJ. B (" + String(durasiTampilDetik) + "s)  ");
  else if (currentSystemState == TUNGGU_REAKSI) {
    int sisaWaktu = (WAKTU_JEDA_ADUK - (millis() - mixingStartTime)) / 1000;
    lcd.print("STAT: ADUK (" + String(sisaWaktu) + "s)   ");
  } else lcd.print("STAT: RUNNING NORMAL");
}

void displayCalMenu() {
  lcd.setCursor(0, 0); lcd.print("    KALIBRASI      ");
  printMenuLine(1, "PH",   calMenuIndex == 0);
  printMenuLine(2, "TDS",  calMenuIndex == 1);
  printMenuLine(3, "SUHU", calMenuIndex == 2);
}

void printMenuLine(int row, const char* label, bool selected) {
  lcd.setCursor(0, row);
  if (selected) lcd.print(blinkState ? ">>  " : "    ");
  else lcd.print("    ");
  lcd.print(label);
  int used = 4 + strlen(label);
  for (int i = used; i < 20; i++) lcd.print(" ");
}

void displayCalPHSubmenu() {
  lcd.setCursor(0, 0); lcd.print("  KALIBRASI pH     ");
  lcd.setCursor(0, 1);
  bool isEditing = (currentMode == MODE_CAL_PH_EDIT_REF);
  if (phSubIndex == 0) lcd.print(isEditing ? ">>  " : (blinkState ? ">>  " : "    "));
  else lcd.print("    ");
  char bufRef[17]; snprintf(bufRef, sizeof(bufRef), "Set Ref   [%.2f]", phReferensi); lcd.print(bufRef);
  printMenuLine(2, "START", phSubIndex == 1);
  printMenuLine(3, "SAVE", phSubIndex == 2);
}

void displayCalPHSampling() {
  lcd.setCursor(0, 0); lcd.print("  KALIBRASI pH     ");
  lcd.setCursor(0, 1); lcd.print("Celupkan Probe pH   ");
  lcd.setCursor(0, 2);
  char line[21]; snprintf(line, sizeof(line), "TERBACA:   [%.3f V]", voltPH); lcd.print(line);
  lcd.setCursor(0, 3); lcd.print("CLICK to SAMPLING   ");
}

void displayWarningPH() {
  lcd.setCursor(0, 0); lcd.print("    PERINGATAN     ");
  lcd.setCursor(0, 1); lcd.print("Tidak bisa di save  ");
  lcd.setCursor(0, 2);
  char l[21]; snprintf(l, sizeof(l), "hanya %d sampel      ", phPointCount); lcd.print(l);
  lcd.setCursor(0, 3); lcd.print("Minimal 2 sampel    ");
}

void displayCalTDSSubmenu() {
  lcd.setCursor(0, 0); lcd.print("  KALIBRASI TDS    ");
  lcd.setCursor(0, 1);
  bool isEditing = (currentMode == MODE_CAL_TDS_EDIT_REF);
  if (tdsSubIndex == 0) lcd.print(isEditing ? ">>  " : (blinkState ? ">>  " : "    "));
  else lcd.print("    ");
  char bufRef[17]; snprintf(bufRef, sizeof(bufRef), "Set Ref  [%4d]", (int)tdsReferensi); lcd.print(bufRef); lcd.print("  ");
  printMenuLine(2, "START", tdsSubIndex == 1);
  printMenuLine(3, "SAVE", tdsSubIndex == 2);
}

void displayCalTDSSampling() {
  lcd.setCursor(0, 0); lcd.print("  KALIBRASI TDS    ");
  lcd.setCursor(0, 1); lcd.print("Celupkan Probe TDS  ");
  lcd.setCursor(0, 2);
  char line[21]; snprintf(line, sizeof(line), "TERBACA:   [%.3f V]", voltTDS); lcd.print(line);
  lcd.setCursor(0, 3); lcd.print("CLICK to SAMPLING   ");
}

void displayWarningTDS() {
  lcd.setCursor(0, 0); lcd.print("    PERINGATAN     ");
  lcd.setCursor(0, 1); lcd.print("Tidak bisa di save  ");
  lcd.setCursor(0, 2);
  char l[21]; snprintf(l, sizeof(l), "hanya %d sampel      ", tdsPointCount); lcd.print(l);
  lcd.setCursor(0, 3); lcd.print("Minimal 2 sampel    ");
}

// ==========================================
// HANDLING TOMBOL ENCODER
// ==========================================
void handleButton() {
  bool swState = digitalRead(PIN_ENCODER_SW);
  if (swState == LOW && swLastState == HIGH) { swPressStart = millis(); swIsPressed = true; longPressTriggered = false; }
  if (swState == LOW && swIsPressed && !longPressTriggered) {
    if (millis() - swPressStart >= LONG_PRESS_MS) { longPressTriggered = true; onLongPress(); }
  }
  if (swState == HIGH && swLastState == LOW) {
    if (!longPressTriggered) onShortPress();
    swIsPressed = false;
  }
  swLastState = swState;
}

void onShortPress() {
  if (currentMode == MODE_CAL_PH_WARNING || currentMode == MODE_CAL_TDS_WARNING) return;
  switch (currentMode) {
    case MODE_MONITOR:
      if (!sudahSetTanggal) { currentMode = MODE_PILIH_TANAMAN; lcd.clear(); }
      break;
    case MODE_PILIH_TANAMAN:
      currentMode = MODE_SET_USIA; lcd.clear();
      break;
    case MODE_SET_USIA:
      usiaAktual = usiaAwalBibit; sudahSetTanggal = true;
      preferences.putBool("is_set", true);
      preferences.putInt("idx_tanaman", indeksTanaman);
      preferences.putInt("usia", usiaAktual);
      currentMode = MODE_MONITOR; lcd.clear();
      break;

    case MODE_CAL_MENU:
      if (calMenuIndex == 0) { phPointCount = 0; phSubIndex = 0; currentMode = MODE_CAL_PH_SUBMENU; lcd.clear(); }
      else if (calMenuIndex == 1) { tdsPointCount = 0; tdsSubIndex = 0; currentMode = MODE_CAL_TDS_SUBMENU; lcd.clear(); }
      break;
    
    case MODE_CAL_PH_SUBMENU:
      if (phSubIndex == 0) { currentMode = MODE_CAL_PH_EDIT_REF; lastEncStepTime = millis(); }
      else if (phSubIndex == 1) { currentMode = MODE_CAL_PH_SAMPLING; lcd.clear(); }
      else if (phSubIndex == 2) {
        if (phPointCount < 2) { currentMode = MODE_CAL_PH_WARNING; warningStartTime = millis(); lcd.clear(); }
        else { hitungKalibrasiPH(); tampilkanHasilSimpan("pH", calSlopePH, calOffsetPH, phPointCount); currentMode = MODE_MONITOR; lcd.clear(); }
      }
      break;
    case MODE_CAL_PH_EDIT_REF: currentMode = MODE_CAL_PH_SUBMENU; break;
    case MODE_CAL_PH_SAMPLING:
      if (phPointCount < MAX_PH_POINTS) { phPointRef[phPointCount] = phReferensi; phPointVolt[phPointCount] = voltPH; phPointCount++; }
      currentMode = MODE_CAL_PH_SUBMENU; lcd.clear(); break;

    case MODE_CAL_TDS_SUBMENU:
      if (tdsSubIndex == 0) { currentMode = MODE_CAL_TDS_EDIT_REF; lastEncStepTime = millis(); }
      else if (tdsSubIndex == 1) { currentMode = MODE_CAL_TDS_SAMPLING; lcd.clear(); }
      else if (tdsSubIndex == 2) {
        if (tdsPointCount < 2) { currentMode = MODE_CAL_TDS_WARNING; warningStartTime = millis(); lcd.clear(); }
        else { hitungKalibrasiTDS(); tampilkanHasilSimpan("TDS", calSlopeTDS, calOffsetTDS, tdsPointCount); currentMode = MODE_MONITOR; lcd.clear(); }
      }
      break;
    case MODE_CAL_TDS_EDIT_REF: currentMode = MODE_CAL_TDS_SUBMENU; break;
    case MODE_CAL_TDS_SAMPLING:
      if (tdsPointCount < MAX_TDS_POINTS) { tdsPointRef[tdsPointCount] = tdsReferensi; tdsPointVolt[tdsPointCount] = voltTDS; tdsPointCount++; }
      currentMode = MODE_CAL_TDS_SUBMENU; lcd.clear(); break;
  }
}

void onLongPress() {
  if (currentMode == MODE_MONITOR) {
    if (sudahSetTanggal) {
      sudahSetTanggal = false; preferences.putBool("is_set", false);
      digitalWrite(PIN_RELAY_NUTRISI_A, HIGH); digitalWrite(PIN_RELAY_NUTRISI_B, HIGH); digitalWrite(PIN_RELAY_PH_UP, HIGH);
      currentSystemState = RUNNING_NORMAL;
      lcd.clear(); lcd.setCursor(0,1); lcd.print("   SISTEM DI-RESET  ");
      lcd.setCursor(0,2); lcd.print(" KEMBALI KE STANDBY ");
      delay(2000); lcd.clear();
    } else {
      currentMode = MODE_CAL_MENU; calMenuIndex = 0; lcd.clear();
    }
  } else {
    currentMode = MODE_MONITOR; lcd.clear();
  }
}

// ==========================================
// KALKULASI REGRESI LINEAR
// ==========================================
void hitungKalibrasiPH() {
  if (phPointCount < 2) return;
  float sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0; int n = phPointCount;
  for (int i = 0; i < n; i++) {
    float x = phPointVolt[i], y = phPointRef[i];
    sumX += x; sumY += y; sumXY += x * y; sumX2 += x * x;
  }
  float denom = (n * sumX2 - sumX * sumX);
  if (abs(denom) < 0.0001) return;
  calSlopePH = (n * sumXY - sumX * sumY) / denom;
  calOffsetPH = (sumY - calSlopePH * sumX) / n;

  preferences.putFloat("ph_slope", calSlopePH); preferences.putFloat("ph_offset", calOffsetPH);
}

void hitungKalibrasiTDS() {
  if (tdsPointCount < 2) return;
  float sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0; int n = tdsPointCount;
  for (int i = 0; i < n; i++) {
    float x = tdsPointVolt[i], y = tdsPointRef[i];
    sumX += x; sumY += y; sumXY += x * y; sumX2 += x * x;
  }
  float denom = (n * sumX2 - sumX * sumX);
  if (abs(denom) < 0.0001) return;
  calSlopeTDS = (n * sumXY - sumX * sumY) / denom;
  calOffsetTDS = (sumY - calSlopeTDS * sumX) / n;

  preferences.putFloat("tds_slope", calSlopeTDS); preferences.putFloat("tds_offset", calOffsetTDS);
}

// ==========================================
// UTILITIES
// ==========================================
void handleBlink() {
  if (millis() - lastBlinkToggle >= BLINK_INTERVAL_MS) { lastBlinkToggle = millis(); blinkState = !blinkState; }
}

float getStepBySpeedPH(unsigned long deltaT) {
  if (deltaT < 30) return 1.0; if (deltaT < 80) return 0.5; if (deltaT < 150) return 0.1; return 0.01;
}

float getStepBySpeedTDS(unsigned long deltaT) {
  if (deltaT < 30) return 100.0; if (deltaT < 80) return 50.0; if (deltaT < 150) return 10.0; return 1.0;
}

void blinkBacklightFast(int times) {
  for (int i = 0; i < times; i++) { lcd.noBacklight(); delay(100); lcd.backlight(); delay(100); }
}

void tampilkanHasilSimpan(const char* namaSensor, float slope, float offset, int jumlahTitik) {
  lcd.clear(); lcd.setCursor(0, 0);
  char l0[21], l1[21], l2[21], l3[21];
  snprintf(l0, sizeof(l0), " Kalibrasi %s Disimpan", namaSensor); lcd.print(l0); lcd.setCursor(0, 1);
  snprintf(l1, sizeof(l1), "Slope : %.3f", slope); lcd.print(l1); lcd.setCursor(0, 2);
  snprintf(l2, sizeof(l2), "Offset: %.3f", offset); lcd.print(l2); lcd.setCursor(0, 3);
  snprintf(l3, sizeof(l3), "Titik data: %d", jumlahTitik); lcd.print(l3);
  blinkBacklightFast(3); delay(2000);
}