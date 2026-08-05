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
// 3. VARIABEL STATE MACHINE & UI MENU
// ==========================================
enum MenuState { MONITOR, PILIH_TANAMAN, SET_USIA };
MenuState currentState = MONITOR;

enum DosingState { RUNNING_NORMAL, PH_UP_INJECT, TDS_INJECT_A, TDS_INJECT_B, TUNGGU_REAKSI, PAUSED };
DosingState currentSystemState = RUNNING_NORMAL;

String daftarTanaman[] = {"SELADA", "SAWI", "BAYAM", "KANGKUNG", "PAKCOY", "CAISIM", "SELEDRI", "KALE", "MINT"};
int jumlahTanaman = 9;
int indeksTanaman = 0;

int lut_pompa[5][3] = {
  {0, 0, 0},                 
  {0, 0, 0},                 
  {8000, 7000, 6000},        
  {15100, 14100, 13100},     
  {22100, 21100, 20100}      
};

bool sudahSetTanggal = false;
int usiaAwalBibit = 1;
int usiaAktual = 0;

float currentPH = 0.0;
float currentPPM = 0.0;
float temperature = 0.0;
float current_mA = 0.0; 

float targetPH_Minimal = 6.0; 
float targetPPM_Minimal = 0.0; 

// Variabel Rotary Encoder & Long Press
int lastStateCLK;
unsigned long buttonPressStartTime = 0;
bool isButtonPressed = false;
bool longPressExecuted = false;
const unsigned long LONG_PRESS_TIME = 2000; // Tahan 2 Detik

unsigned long lastSensorRead = 0;
unsigned long lastLCDUpdate = 0;
unsigned long mixingStartTime = 0;

const unsigned long WAKTU_JEDA_ADUK = 120000; 
int durasiTampilDetik = 0; 

// ==========================================
// --- DEKLARASI FUNGSI / PROTOTYPE ---
// ==========================================
void bacaRotaryEncoder();
void bacaSemuaSensor();
void perbaruiTampilanLCD();
void sesuaikanTargetNutrisi();

// ==========================================
// 4. FUNGSI SETUP (EKSEKUSI AWAL)
// ==========================================
void setup() {
  Serial.begin(115200);
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
  
  if (!ina219.begin()) {
    Serial.println("Gagal menemukan chip INA219!");
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
  lastStateCLK = digitalRead(PIN_ENCODER_CLK);

  preferences.begin("hydro_sys", false);
  
  sudahSetTanggal = preferences.getBool("is_set", false);
  if (sudahSetTanggal) {
    indeksTanaman = preferences.getInt("idx_tanaman", 0);
    usiaAktual = preferences.getInt("usia", 1);
    usiaAwalBibit = usiaAktual; 
    currentState = MONITOR; 
  }
}

// ==========================================
// 5. LOOP UTAMA (JANTUNG SISTEM)
// ==========================================
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

  if (!sudahSetTanggal) {
    digitalWrite(PIN_RELAY_NUTRISI_A, HIGH);
    digitalWrite(PIN_RELAY_NUTRISI_B, HIGH);
    digitalWrite(PIN_RELAY_PH_UP, HIGH);
    return; 
  }

  sesuaikanTargetNutrisi();

  // ==========================================
  // 6. BLOK KONTROL AKTUATOR OTOMATIS
  // ==========================================
  if (currentSystemState == PAUSED) {
    return; 
  }

  if (currentSystemState == TUNGGU_REAKSI) {
    if (millis() - mixingStartTime >= WAKTU_JEDA_ADUK) {
      currentSystemState = RUNNING_NORMAL;
    }
    return; 
  }

  if (currentPH < targetPH_Minimal && currentSystemState == RUNNING_NORMAL) {
    currentSystemState = PH_UP_INJECT;
    perbaruiTampilanLCD(); 
    digitalWrite(PIN_RELAY_PH_UP, LOW); delay(2000); digitalWrite(PIN_RELAY_PH_UP, HIGH); 
    currentSystemState = TUNGGU_REAKSI;
    mixingStartTime = millis(); 
    perbaruiTampilanLCD();
  }
  else if (currentSystemState == RUNNING_NORMAL) {
    float error_TDS = targetPPM_Minimal - currentPPM;
    int baris_error = 0;
    int kolom_suhu = 0;

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
      
      currentSystemState = TUNGGU_REAKSI;
      mixingStartTime = millis(); 
      perbaruiTampilanLCD();
    }
  }
}

// ==========================================
// 7. FUNGSI PENYESUAIAN TARGET [9 TANAMAN]
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
// 8. FUNGSI PEMBACAAN SENSOR 
// ==========================================
void bacaSemuaSensor() {
  sensorSuhu.requestTemperatures();
  temperature = sensorSuhu.getTempCByIndex(0);

  int16_t adc_ph = ads.readADC_SingleEnded(1);
  float voltage_ph = ads.computeVolts(adc_ph);
  currentPH = (-6.33 * voltage_ph) + 23.00;
  if (currentPH < 0.0) currentPH = 0.0;
  if (currentPH > 14.0) currentPH = 14.0;

  float kValueTDS = 1300.0 / 1417.0;
  int16_t adc_tds = ads.readADC_SingleEnded(0);
  float voltage_tds = ads.computeVolts(adc_tds);
  currentPPM = (voltage_tds * 575.83) * kValueTDS; 
  
  current_mA = ina219.getCurrent_mA();
  if (current_mA < 0) {
    current_mA = 0.0; // Filter noise arus minus
  }
}

// ==========================================
// 9. FUNGSI UI / LAYAR LCD
// ==========================================
void perbaruiTampilanLCD() {
  switch (currentState) {
    case MONITOR:
      { 
        String teksKiri = "PLANT:" + daftarTanaman[indeksTanaman];
        String teksKanan = String(current_mA, 0) + "mA";
        
        int sisaSpasi = 20 - teksKiri.length() - teksKanan.length();
        String spasi = "";
        
        if (sisaSpasi > 0) {
          for (int i = 0; i < sisaSpasi; i++) spasi += " ";
        } else {
          teksKiri = "P:" + daftarTanaman[indeksTanaman];
          sisaSpasi = 20 - teksKiri.length() - teksKanan.length();
          for (int i = 0; i < sisaSpasi; i++) spasi += " ";
        }

        lcd.setCursor(0, 0); 
        lcd.print(teksKiri + spasi + teksKanan);
      }
      
      lcd.setCursor(0, 1);
      if (sudahSetTanggal) {
        lcd.print("UMUR: H-" + String(usiaAktual) + " TGT:" + String(targetPPM_Minimal, 0) + " ");
      } else {
        lcd.print("UMUR: [STBY]        ");
      }
      
      lcd.setCursor(0, 2);
      lcd.print("PPM:" + String(currentPPM, 0) + "  pH:" + String(currentPH, 1) + "     ");
      
      lcd.setCursor(0, 3);
      if (!sudahSetTanggal) {
        lcd.print("STAT: STANDBY WAIT  ");
      }
      else if (currentSystemState == PAUSED) {
        lcd.print("STAT: POMPA NONAKTIF");
      }
      else if (currentSystemState == PH_UP_INJECT) {
        lcd.print("STAT: INJECT pH UP  ");
      }
      else if (currentSystemState == TDS_INJECT_A) {
        lcd.print("STAT: INJ. A (" + String(durasiTampilDetik) + "s)  ");
      }
      else if (currentSystemState == TDS_INJECT_B) {
        lcd.print("STAT: INJ. B (" + String(durasiTampilDetik) + "s)  ");
      }
      else if (currentSystemState == TUNGGU_REAKSI) {
        int sisaWaktu = (WAKTU_JEDA_ADUK - (millis() - mixingStartTime)) / 1000;
        lcd.print("STAT: ADUK (" + String(sisaWaktu) + "s)   ");
      }
      else {
        lcd.print("STAT: RUNNING NORMAL");
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

// ==========================================
// 10. FUNGSI KENDALI MENU & MEMORI
// ==========================================
void bacaRotaryEncoder() {
  int currentStateCLK = digitalRead(PIN_ENCODER_CLK);
  if (currentStateCLK != lastStateCLK  && currentStateCLK == 1) {
    if (digitalRead(PIN_ENCODER_DT) != currentStateCLK) {
      if (currentState == PILIH_TANAMAN) {
        indeksTanaman++;
        if (indeksTanaman >= jumlahTanaman) indeksTanaman = 0;
      } else if (currentState == SET_USIA) {
        usiaAwalBibit++;
      }
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

  int btnState = digitalRead(PIN_ENCODER_SW);
  
  if (btnState == LOW && !isButtonPressed) {
    delay(50); 
    isButtonPressed = true;
    buttonPressStartTime = millis();
    longPressExecuted = false;
  }

  // --- LOGIKA LONG PRESS (RESET & GANTI TANAMAN) ---
  if (btnState == LOW && isButtonPressed && !longPressExecuted) {
    if (millis() - buttonPressStartTime > LONG_PRESS_TIME) {
      longPressExecuted = true; 
      
      if (sudahSetTanggal && currentState == MONITOR) {
        // RESET TOTAL
        sudahSetTanggal = false;
        currentSystemState = RUNNING_NORMAL;
        
        digitalWrite(PIN_RELAY_NUTRISI_A, HIGH);
        digitalWrite(PIN_RELAY_NUTRISI_B, HIGH);
        digitalWrite(PIN_RELAY_PH_UP, HIGH);
        
        preferences.putBool("is_set", false);
        
        lcd.clear();
        lcd.setCursor(0,1); lcd.print("   SISTEM DI-RESET  ");
        lcd.setCursor(0,2); lcd.print(" KEMBALI KE STANDBY ");
        delay(2000);
        
        currentState = PILIH_TANAMAN;
        lcd.clear();
      }
    }
  }

  // --- LOGIKA SHORT PRESS ---
  if (btnState == HIGH && isButtonPressed) {
    isButtonPressed = false;
    
    if (!longPressExecuted && (millis() - buttonPressStartTime > 50)) {
      
      // [UPDATE] SHORT PRESS SAAT MONITOR = PAUSE / RESUME POMPA
      if (currentState == MONITOR && sudahSetTanggal) {
        if (currentSystemState != PAUSED) {
          currentSystemState = PAUSED;
          digitalWrite(PIN_RELAY_NUTRISI_A, HIGH);
          digitalWrite(PIN_RELAY_NUTRISI_B, HIGH);
          digitalWrite(PIN_RELAY_PH_UP, HIGH);
        } else {
          currentSystemState = RUNNING_NORMAL;
        }
      } 
      else if (currentState == MONITOR && !sudahSetTanggal) {
        currentState = PILIH_TANAMAN; 
        lcd.clear();
      } 
      else if (currentState == PILIH_TANAMAN) {
        currentState = SET_USIA; 
        lcd.clear();
      } 
      else if (currentState == SET_USIA) {
        usiaAktual = usiaAwalBibit;
        sudahSetTanggal = true;
        
        preferences.putBool("is_set", true);
        preferences.putInt("idx_tanaman", indeksTanaman);
        preferences.putInt("usia", usiaAktual);
        
        currentState = MONITOR;
        lcd.clear();
      }
    }
  }
}