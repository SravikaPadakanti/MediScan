# <h1>MediScan</h1>
Accessing information of medicines via QR Code

<h2>Problem Statement</h2>
In today's fast-paced world, patients often struggle to access critical information on their tablet sheets, such as manufacturing details, side effects, and instructions for use. Traditional medicine tablet sheets are often cluttered and have limited space on tablet sheet, which results in condensed, small-font text that may be difficult to read, especially for individuals with visual impairments. The information is only provided in a single language, making it difficult for non-native speakers  to understand.</p> 

<h2>Scope</h2>
   This project aims to solve these challenges by embedding QR codes on each tablet byte in a medicine sheet, providing instant, multilingual access to clear and comprehensive medication information in a website.

<h2>Application Areas</h2>

<ul>
  <li>
    <h4>Pharmaceutical Packaging:</h4>
    QR codes on packaging provide detailed medicine information such as ingredients, usage instructions, and warnings.
  </li>
  <li>
    <h4>Patient Empowerment:</h4>
    Enables patients to understand medication details in their preferred language, reducing the risk of misuse.
  </li>
  <li>
    <h4>Healthcare Education:</h4>
    Assists medical students and professionals by providing detailed insights into tablet compositions, usage, and precautions.
  </li>
  <li>
    <h4>Pharmacy Support:</h4>
    Helps pharmacies provide additional information to customers without relying on physical leaflets.
  </li>
  <li>
    <h4>Support for Visually Impaired Users:</h4>
    Supports patients with visual impairments by providing audio descriptions or large-font details.
  </li>
</ul>

<h2>Key Features of the Project</h2>

<ul>
  <li>
    <h4>Custom QR Code for Every Medication:</h4>
    Each tablet strip is linked to a unique QR code for specific information.
  </li>
  <li>
    <h4>Real-Time Translation of Medication Details:</h4>
    Uses Google Cloud Translation API to provide information in the user's preferred language.
  </li>
  <li>
    <h4>Detailed Medication Information:</h4>
    Displays the name of the medicine, active ingredients, common uses, storage instructions, manufacturer details, expiry date, side effects, and warnings for each tablet.
  </li>
  <li>
    <h4>User-Friendly Web Interface:</h4>
    Simple, intuitive web pages for easy access to medication information.
  </li>
  <li>
    <h4>Secure and Scalable Database:</h4>
    Data stored and managed efficiently using MySQL.
  </li>
</ul>

<h2>Tools</h2>
<ul>
<li><p><b>Docker(Container)</b></p></li>
<li><p><b>Javascript</b></p></li>
<li><p><b>Express</b></p></li>
<li><p><b>NodeJS</b></p></li>
<li><p><b>LibreTranslate API</b></p></li>
<li><p><b>Python</b></p></li>
<li><p><b>HTML</b></p></li>
<li><p><b>CSS</b></p></li>
</ul>

<h2>Input Specifications:</h2>
<ul>
  <li>QR Code Scanning</li>
  <li>Language Selection</li>
</ul>

<h2>Output Specifications:</h2>
<ul>
  <li>Detailed Medicine Information</li>
  <li>Provides the information in the preferred language (if selected)</li>
</ul>
<h2>Results and Screenshots of the Project</h2>


## Flow of Project
![Flow of Project](https://raw.githubusercontent.com/SravikaPadakanti/MediScan/main/Flow_of_project.jpeg)

---

## QR Images
<div style="display: flex; justify-content: space-between;">
  <img src="https://raw.githubusercontent.com/SravikaPadakanti/MediScan/main/Becosule_capsules__B_Complex_Forte_With_vitamin_C_Capsules__QR.png" width="200" height="200">
  <img src="https://raw.githubusercontent.com/SravikaPadakanti/MediScan/main/Crocin_Pain_Relief_Tablets_15's._QR.png" width="200" height="200">
  <img src="https://raw.githubusercontent.com/SravikaPadakanti/MediScan/main/Saridon_QR.png" width="200" height="200">
  <img src="https://raw.githubusercontent.com/SravikaPadakanti/MediScan/main/__DOLO_650_QR.png" width="200" height="200">
</div>

---

## HomePage and Scanner Image
<div style="display: flex; justify-content: space-between;">
  <img src="https://raw.githubusercontent.com/SravikaPadakanti/MediScan/main/HomePage_Scan_Button.png" width="200" height="200">
  <img src="https://raw.githubusercontent.com/SravikaPadakanti/MediScan/main/Scanner_image.png" width="200" height="200">
</div>

---

## Dolo650 English Page
![Dolo650 English Page](https://raw.githubusercontent.com/SravikaPadakanti/MediScan/main/Dolo650_English_page.jpeg)

---

## Crocin Tablet Drop Down Box
![Crocin Tablet Display Page](https://raw.githubusercontent.com/SravikaPadakanti/MediScan/main/Crocin_tablet_Display_Page_Drop_Down_Box_For_Languages.jpeg)

---

## Translated Pages
<div style="display: flex; justify-content: space-between;">
  <img src="https://raw.githubusercontent.com/SravikaPadakanti/MediScan/main/Dolo650_Translated_Page_to_Azerbaijani.jpeg" width="200" height="200">
  <img src="https://raw.githubusercontent.com/SravikaPadakanti/MediScan/main/Translated_Page_Albanian.jpeg" width="200" height="200">
  <img src="https://raw.githubusercontent.com/SravikaPadakanti/MediScan/main/Arabic_Translation.jpeg" width="200" height="200">
</div>

---

## How It Works

1. **Scan QR Code**: Use the app to scan a QR code on the medicine packaging.
2. **Display Information**: The app retrieves and displays detailed information about the medicine, including translations.
3. **Multiple Languages**: Translations are available in multiple languages to assist users globally.

---



