const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
const path = require('path');
const QRCode = require('qrcode');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config(); // For environment variables

// Create an Express app
const app = express();
app.use(cors()); // Enable CORS

// MySQL database connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Sreeja@0912',
    database: process.env.DB_NAME || 'mediscanproject'
});

// Directory for storing QR codes
const qrDir = path.join(__dirname, 'qrcodes');

// Ensure QR code directory exists
if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir);
}

// Database connection
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit if the connection fails
    }
    console.log('Connected to the database.');
});

// Predefined dictionary for specific medicine terms in various languages
const termDictionary = {
    en: {
        'dolo': 'DOLO-650',
        'saridon': 'Saridon',
        'paracetamol': 'Paracetamol',
        'piramal enterprises limited': 'Piramal Enterprises Limited',
        'pfizer': 'Pfizer',
        'micro labs limited': 'Micro Labs Limited',
        'becosule capsules b complex forte with vitamin c capsules': 'Becosule Capsules B Complex Forte with Vitamin C Capsules',
        'caffeine anhydrous': 'Caffeine Anhydrous'
    },
    'fr': {
    'dolo': 'DOLO-650',
    'In case of pregnancy and breastfeeding consult doctor for advice': 'En cas de grossesse et d\'allaitement, consultez un médecin pour des conseils',
    'GSK consumer Healthcare ltd': 'GSK Consumer Healthcare Ltd',
    'saridon': 'Saridon',
    'paracetamol ': 'Paracétamol',
    'paracetamol I.P': 'Paracétamol I.P',
    'mg': 'mg',
    'for symptomatic relief from mild to moderate pain, such as headache, migraine, toothache, and musculoskeletal pains.': 'Pour le soulagement symptomatique des douleurs légères à modérées, telles que les maux de tête, les migraines, les douleurs dentaires et les douleurs musculosquelettiques.',
    'Likely includes a combination of B complex vitamins and Vitamin C (similar to typical formulations): Vitamin B1 (Thiamine) Vitamin B2 (Riboflavin) Vitamin B3 (Niacinamide) Vitamin B5 (Calcium Pantothenate) Vitamin B6 (Pyridoxine) Vitamin B12 (Cyanocobalamin) Folic Acid Vitamin C Biotin': 
    'Inclut probablement une combinaison de vitamines du complexe B et de la vitamine C (similaire aux formulations typiques) : Vitamine B1 (Thiamine) Vitamine B2 (Riboflavine) Vitamine B3 (Niacinamide) Vitamine B5 (Pantothénate de calcium) Vitamine B6 (Pyridoxine) Vitamine B12 (Cyanocobalamine) Acide folique Vitamine C Biotine',
    'piramal enterprises limited': 'Piramal Enterprises Limited',
    'pfizer': 'Pfizer',
    'micro labs limited': 'Micro Labs Limited',
    'becosule capsules b complex forte with vitamin c capsules': 'Gélules Becosule B Complex Forte avec Vitamine C',
    'caffeine anhydrous': 'Caféine Anhydre'
},

    'es': {
    'dolo': 'DOLO-650',
    'In case of pregnancy and breastfeeding consult doctor for advice': 'En caso de embarazo y lactancia, consulte a un médico para obtener asesoramiento',
    'GSK consumer Healthcare ltd': 'GSK Consumer Healthcare Ltd',
    'saridon': 'Saridon',
    'paracetamol ': 'Paracetamol',
    'paracetamol I.P': 'Paracetamol I.P',
    'mg': 'mg',
    'for symptomatic relief from mild to moderate pain, such as headache, migraine, toothache, and musculoskeletal pains.': 'Para el alivio sintomático del dolor leve a moderado, como dolor de cabeza, migraña, dolor de muelas y dolores musculoesqueléticos.',
    'Likely includes a combination of B complex vitamins and Vitamin C (similar to typical formulations): Vitamin B1 (Thiamine) Vitamin B2 (Riboflavin) Vitamin B3 (Niacinamide) Vitamin B5 (Calcium Pantothenate) Vitamin B6 (Pyridoxine) Vitamin B12 (Cyanocobalamin) Folic Acid Vitamin C Biotin': 
    'Probablemente incluye una combinación de vitaminas del complejo B y vitamina C (similar a las formulaciones típicas): Vitamina B1 (Tiamina) Vitamina B2 (Riboflavina) Vitamina B3 (Niacinamida) Vitamina B5 (Pantotenato de calcio) Vitamina B6 (Piridoxina) Vitamina B12 (Cianocobalamina) Ácido fólico Vitamina C Biotina',
    'piramal enterprises limited': 'Piramal Enterprises Limited',
    'pfizer': 'Pfizer',
    'micro labs limited': 'Micro Labs Limited',
    'becosule capsules b complex forte with vitamin c capsules': 'Cápsulas Becosule B Complex Forte con Vitamina C',
    'caffeine anhydrous': 'Cafeína Anhidra'
},

    ar: {
         
    'dolo': 'دولو-650',
    'In case of pregnancy and breastfeeding consult doctor for advice': 'في حالة الحمل والرضاعة الطبيعية، استشر الطبيب للحصول على المشورة',
    'GSK consumer Healthcare ltd': 'شركة جي إس كيه للرعاية الصحية',
    'saridon': 'ساريدون',
    'paracetamol ': 'باراسيتامول',
    'paracetamol I.P': 'باراسيتامول I.P',
    'mg': 'ملجم',
    'for symptomatic relief from mild to moderate pain,such as headache,migrane,toothache,and musculoskeletal pains.': 'لتخفيف الأعراض الناتجة عن الألم الخفيف إلى المتوسط، مثل الصداع، الشقيقة، ألم الأسنان، وآلام الجهاز العضلي الهيكلي.',
    'Likely includes a combination of B complex vitamins and Vitamin C (similar to typical formulations): Vitamin B1 (Thiamine) Vitamin B2 (Riboflavin) Vitamin B3 (Niacinamide) Vitamin B5 (Calcium Pantothenate) Vitamin B6 (Pyridoxine) Vitamin B12 .(Cyanocobalamin) Folic Acid Vitamin C Biotin': 
    'من المحتمل أن يشمل مزيجًا من فيتامينات ب المركب وفيتامين سي (مماثلة للتراكيب المعتادة): فيتامين ب1 (الثيامين) فيتامين ب2 (الريبوفلافين) فيتامين ب3 (النياسيناميد) فيتامين ب5 (كالسيوم بانتوثينات) فيتامين ب6 (البيريدوكسين) فيتامين ب12 (السيانوكوبالامين) حمض الفوليك فيتامين سي البيوتين',
    'piramal enterprises limited': 'شركة بيرامال المحدودة',
    'pfizer': 'فايزر',
    'micro labs limited': 'مختبرات مايكرو المحدودة',
    'becosule capsules b complex forte with vitamin c capsules': 'كبسولات بيكوسول بي كومبلكس فورت مع كبسولات فيتامين سي',
    'caffeine anhydrous': 'الكافيين اللامائي'


    },
    'az': {
    'dolo': 'DOLO-650',
    'In case of pregnancy and breastfeeding consult doctor for advice': 'Hamiləlik və əmizdirmə zamanı həkimə müraciət edin',
    'GSK consumer Healthcare ltd': 'GSK istehlakçı Sağlamlıq şirkəti',
    'saridon': 'Saridon',
    'paracetamol ': 'Parasetomol',
    'paracetamol I.P': 'Parasetomol I.P',
    'mg': 'mq',
    'for symptomatic relief from mild to moderate pain,such as headache,migrane,toothache,and musculoskeletal pains.': 'Yüngül və orta dərəcədə ağrıların, məsələn, baş ağrısı, miqren, diş ağrısı və əzələ-skelet ağrılarının simptomatik yüngülləşdirilməsi üçün.',
    'Likely includes a combination of B complex vitamins and Vitamin C (similar to typical formulations): Vitamin B1 (Thiamine) Vitamin B2 (Riboflavin) Vitamin B3 (Niacinamide) Vitamin B5 (Calcium Pantothenate) Vitamin B6 (Pyridoxine) Vitamin B12 (Cyanocobalamin) Folic Acid Vitamin C Biotin': 
    'Ehtimal ki, B kompleks vitaminləri və Vitamin C-in (tipik tərkiblərə bənzər) birləşməsini ehtiva edir: Vitamin B1 (Tiamin) Vitamin B2 (Riboflavin) Vitamin B3 (Niacinamid) Vitamin B5 (Kalsium Pantotenat) Vitamin B6 (Piridoksin) Vitamin B12 (Sianokobalamin) Folik Asid Vitamin C Biotin',
    'piramal enterprises limited': 'Piramal Enterprises Limited',
    'pfizer': 'Pfizer',
    'micro labs limited': 'Micro Labs Limited',
    'becosule capsules b complex forte with vitamin c capsules': 'Becosule B Kompleks Forte ilə Vitamin C kapsulları',
    'caffeine anhydrous': 'Kafein Anhidrat'
},
'eu': {
    'dolo': 'DOLO-650',
    'In case of pregnancy and breastfeeding consult doctor for advice': 'Haurdunaldian eta edoskitzaroan medikuarekin kontsultatu aholkuak jasotzeko',
    'GSK consumer Healthcare ltd': 'GSK kontsumitzaileen Osasunaren Ltd',
    'saridon': 'Saridon',
    'paracetamol ': 'Parazetamol',
    'paracetamol I.P': 'Parazetamol I.P',
    'mg': 'mg',
    'for symptomatic relief from mild to moderate pain,such as headache,migrane,toothache,and musculoskeletal pains.': 'Min arin eta ertainak, hala nola buruko mina, migraña, hortz mina eta muskulu-eskeletiko minak arintzeko sintoma arintzeko.',
    'Likely includes a combination of B complex vitamins and Vitamin C (similar to typical formulations): Vitamin B1 (Thiamine) Vitamin B2 (Riboflavin) Vitamin B3 (Niacinamide) Vitamin B5 (Calcium Pantothenate) Vitamin B6 (Pyridoxine) Vitamin B12 (Cyanocobalamin) Folic Acid Vitamin C Biotin': 
    'Litekeena da B konplexuko bitamina eta C bitaminaren konbinazioa (formulazio tipikoekin antzekoa): Vitamin B1 (Tiamina) Vitamin B2 (Riboflavina) Vitamin B3 (Niacinamida) Vitamin B5 (Kaltzio Pantotenato) Vitamin B6 (Piridoksina) Vitamin B12 (Cianokobalamina) Azido Foliko C Bitamina Biotina',
    'piramal enterprises limited': 'Piramal Enterprises Limited',
    'pfizer': 'Pfizer',
    'micro labs limited': 'Micro Labs Limited',
    'becosule capsules b complex forte with vitamin c capsules': 'Becosule B konplexuko forte kapsulak C bitaminarekin',
    'caffeine anhydrous': 'Kafeina Anhidratatu'
},
'sq': {
    'dolo': 'DOLO-650',
    'In case of pregnancy and breastfeeding consult doctor for advice': 'Në rastin e shtatzënisë dhe gjidhënies, konsultohuni me mjekun për këshilla',
    'GSK consumer Healthcare ltd': 'GSK konsumatore Healthcare ltd',
    'saridon': 'Saridon',
    'paracetamol ': 'Paracetamol',
    'paracetamol I.P': 'Paracetamol I.P',
    'mg': 'mg',
    'for symptomatic relief from mild to moderate pain,such as headache,migrane,toothache,and musculoskeletal pains.': 'Për lehtësimin simptomatik të dhimbjeve të lehta deri te ato të moderuara, si dhimbjet e kokës, migrena, dhimbja e dhëmbëve dhe dhimbjet muskulore.',
    'Likely includes a combination of B complex vitamins and Vitamin C (similar to typical formulations): Vitamin B1 (Thiamine) Vitamin B2 (Riboflavin) Vitamin B3 (Niacinamide) Vitamin B5 (Calcium Pantothenate) Vitamin B6 (Pyridoxine) Vitamin B12 (Cyanocobalamin) Folic Acid Vitamin C Biotin': 
    'Përfshin ndoshta një kombinim të vitaminave B kompleks dhe Vitaminës C (të ngjashëm me formulat tipike): Vitamin B1 (Tiamina) Vitamin B2 (Riboflavina) Vitamin B3 (Niacinamidi) Vitamin B5 (Pantotenati i Kalciumit) Vitamin B6 (Piridoksina) Vitamin B12 (Cianokobalamina) Acidi Folik Vitamin C Biotina',
    'piramal enterprises limited': 'Piramal Enterprises Limited',
    'pfizer': 'Pfizer',
    'micro labs limited': 'Micro Labs Limited',
    'becosule capsules b complex forte with vitamin c capsules': 'Kapsulat Becosule B Complex Forte me vitamina C',
    'caffeine anhydrous': 'Kafeinë Anhidre'
},



    hi: {
        'dolo': 'डोलो-650',
        'saridon': 'सरिडन',
        'paracetamol': 'पैरासिटामोल',
        'piramal enterprises limited': 'पिरामल एंटरप्राइजेज लिमिटेड',
        'pfizer': 'फाइजर',
        'micro labs limited': 'माइक्रो लैब्स लिमिटेड',
        'becosule capsules b complex forte with vitamin c capsules': 'बेकोसूल कैप्सूल्स बी कॉम्प्लेक्स फोर्टे विथ विटामिन सी कैप्सूल्स',
        'caffeine anhydrous': 'कैफीन एन्हायड्रस'
    }
};

// Function to split text into chunks for translation
function splitText(text, maxLength) {
    const regex = new RegExp(`.{1,${maxLength}}`, 'g');
    return text.match(regex) || [];
}

// Function to translate the headings dynamically
async function translateHeadings(language) {
    const headings = [
        'Description',
        'Dosage',
        'Side Effects',
        'Manufacturer',
        'Storage Instructions',
        'Warnings',
        'Composition',
        'Expiry Date',
        'Price Per Tablet',
        'Overall Price',
        'Manufacturing License No'
    ];

    const translatedHeadings = {};

    for (const heading of headings) {
        try {
            const response = await axios.post('http://localhost:5004/translate', {
                q: heading,
                source: 'en',
                target: language
            });
            translatedHeadings[heading] = response.data.translatedText || heading;
        } catch (error) {
            console.error(`Error translating heading "${heading}":`, error.message);
            translatedHeadings[heading] = heading; // Fallback to original heading
        }
    }

    return translatedHeadings;
}

// Update translateMedicineData to include translated headings
async function translateMedicineData(medicine, language) {
    const translationFields = [
        'name',
        'description',
        'dosage',
        'side_effects',
        'manufacturer',
        'storage_instructions',
        'warnings',
        'composition'
    ];

    const translatedData = {};
    const translatedHeadings = await translateHeadings(language);

    // Translate content fields
    for (const field of translationFields) {
        if (medicine[field]) {
            const chunks = splitText(medicine[field], 500);
            const translatedChunks = [];
            for (const chunk of chunks) {
                let translatedText = null;

                // Check the dictionary first
                const term = Object.keys(termDictionary[language] || {}).find(term =>
                    chunk.toLowerCase().includes(term.toLowerCase())
                );
                if (term) {
                    translatedText = termDictionary[language][term];
                } else {
                    // Use translation API if not found in the dictionary
                    try {
                        const response = await axios.post('http://localhost:5004/translate', {
                            q: chunk,
                            source: 'en',
                            target: language
                        });
                        translatedText = response.data.translatedText;
                    } catch (error) {
                        console.error(`Error translating chunk "${chunk}":`, error.message);
                        translatedText = chunk; // Fallback to original text
                    }
                }

                translatedChunks.push(translatedText);
            }
            translatedData[field] = translatedChunks.join(' ');
        } else {
            translatedData[field] = '';
        }
    }

    // Include fields that are not translatable
    translatedData.expiry_date = medicine.expiry_date;
    translatedData.overall_price = medicine.overall_price;
    translatedData.price_pertablet = medicine.price_pertablet;
    translatedData.mfgliscense_no = medicine.mfgliscense_no;

    // Attach translated headings
    translatedData.headings = translatedHeadings;

    // Preserve medicine ID
    translatedData.id = medicine.id;

    return translatedData;
}
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// Update renderMedicineHTML to include a language dropdown
function renderMedicineHTML(medicine, language) {
    const headings = medicine.headings || {};

    // Map of language codes to full names
    const languageNames = {
        en: 'English',
        ar: 'العربية (Arabic)',
        az: 'Azərbaycan dili (Azerbaijani)',
        eu: 'Euskaldun (Basque)',
        sq: 'Shqip (Albanian)'
    };

    const availableLanguages = Object.keys(languageNames);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medicine Information</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');

    body {
      font-family: 'Nunito', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px;
      position: relative;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background : linear-gradient(90deg,#5de0e6,#004aad);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .header h1 {
      font-size: 52px;
      font-weight: 700;
      margin: 0;
      text-transform: uppercase;
      color: white;
      flex-grow: 1;
      text-align: center;
    }

    .home-button {
      background-color: white;
      color: #2bb4d4;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: background-color 0.3s ease;
    }

    .home-button:hover {
      background-color: #f0f0f0;
    }

    .home-button img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    .medicine-info {
      background-color: #e6f0ff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
    }

    .medicine-info h2 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .medicine-info p {
      font-size: 20px;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .medicine-info strong {
      color: #333;
      font-weight: bold;
    }

    .language-select-container {
      display: flex;
      align-items: center;
      position: relative;
    }

    .language-select-container .select-button {
      padding: 4px 8px;
      font-size: 14px;
      background :linear-gradient(90deg,#5de0e6,#004aad) ;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 180px;
    }

    .language-select-container .select-button .translate-icon{
      width: 24px;
      height: 24px;
      margin-left : 8px;
    }

    .language-select-container .select-button:hover {
      background-color: #0056b3;
    }

    .language-select-container .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      background: linear-gradient(90deg,#5de0e6,#004aad);
      color: white;
      border-radius: 4px;
      padding: 10px 0;
      width: 200px;
      z-index: 1;
      display: none;
    }

    .language-select-container .dropdown.show {
      display: block;
    }

    .language-select-container .dropdown option {
      padding: 4px 12px;
      cursor: pointer;
      font-size: 14px;
      white-space: normal;
    }

    .language-select-container .dropdown option:hover {
      background-color: #0056b3;
    }

    footer {
      text-align: center;
      font-size: 16px;
      color: #666;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <button class="home-button" onclick="goToHome()">
        <img src="https://img.icons8.com/ios/50/007bff/home.png" alt="Home" />
        Home
      </button>
      <h1>MEDISCAN</h1>
      <div style="width: 140px;"></div> <!-- Spacer to center title -->
    </div>
    <div class="medicine-info">
      <h2>
        ${medicine.name}
        <div class="language-select-container">
          <div class="select-button">
            <span>Select Language</span>
                       <img src="https://img.icons8.com/color/48/000000/google-translate.png" alt="Translate" class="translate-icon" />
          </div>
          <div class="dropdown">
            ${Object.keys(languageNames).map(lang =>
              `<option value="${lang}" ${lang === language ? 'selected' : ''}>${languageNames[lang]}</option>`
            ).join('')}
          </div>
        </div>
      </h2>
      <p><strong>${headings['Description'] || 'Description'}:</strong> ${medicine.description || 'N/A'}</p>
      <p><strong>${headings['Dosage'] || 'Dosage'}:</strong> ${medicine.dosage || 'N/A'}</p>
      <p><strong>${headings['Side Effects'] || 'Side Effects'}:</strong> ${medicine.side_effects || 'N/A'}</p>
      <p><strong>${headings['Manufacturer'] || 'Manufacturer'}:</strong> ${medicine.manufacturer || 'N/A'}</p>
      <p><strong>${headings['Storage Instructions'] || 'Storage Instructions'}:</strong> ${medicine.storage_instructions || 'N/A'}</p>
      <p><strong>${headings['Warnings'] || 'Warnings'}:</strong> ${medicine.warnings || 'N/A'}</p>
      <p><strong>${headings['Composition'] || 'Composition'}:</strong> ${medicine.composition || 'N/A'}</p>
      <p><strong>${headings['Expiry Date'] || 'Expiry Date'}:</strong> ${medicine.expiry_date || 'N/A'}</p>
      <p><strong>${headings['Price Per Tablet'] || 'Price Per Tablet'}:</strong> ${medicine.price_pertablet || 'N/A'}</p>
      <p><strong>${headings['Overall Price'] || 'Overall Price'}:</strong> ${medicine.overall_price || 'N/A'}</p>
      <p><strong>${headings['Manufacturing License No'] || 'Manufacturing License No'}:</strong> ${medicine.mfgliscense_no || 'N/A'}</p>
    </div>
  </div>
  <footer>
    @powered by Mediscan
  </footer>
  <script>
    const selectButton = document.querySelector('.language-select-container .select-button');
    const dropdown = document.querySelector('.language-select-container .dropdown');
    const dropdownOptions = document.querySelectorAll('.language-select-container .dropdown option');

    selectButton.addEventListener('click', () => {
      dropdown.classList.toggle('show');
    });

    dropdownOptions.forEach(option => {
      option.addEventListener('click', () => {
        const selectedLanguage = option.value;
        const medicineId = "${medicine.id || ''}";
        if (medicineId) {
          window.location.href = "/medicine/" + medicineId + "?lang=" + selectedLanguage;
        } else {
          alert('Medicine ID is missing. Unable to switch language.');
        }
      });
    });

    // Home button functionality
    function goToHome() {
      // Redirect to the home page
      window.location.href = "/"; // Adjust the path as needed for your application
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!selectButton.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
      }
    });
  </script>
</body>
</html>
    `;
}



// Endpoint to serve the medicine page with translated content
app.get('/medicine/:id', async (req, res) => {
    const medicineId = req.params.id;
    const language = req.query.lang || 'en';

    db.query('SELECT * FROM table1 WHERE id = ?', [medicineId], async (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Error retrieving data' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Medicine not found' });
        }

        const medicine = results[0];
        medicine.expiry_date = medicine.expiry_date
            ? new Date(medicine.expiry_date).toISOString().slice(0, 7)
            : null;

        try {
            const translatedData = language !== 'en'
                ? await translateMedicineData(medicine, language)
                : medicine;

            res.send(renderMedicineHTML(translatedData, language));
        } catch (error) {
            console.error('Error during translation:', error);
            res.status(500).json({ error: 'Error translating data' });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


