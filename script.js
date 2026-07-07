// --- NAVIGATION FUNCTIONS ---
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

function toggleAuth(isRegistering) {
    const signInView = document.getElementById('signInView');
    const registerView = document.getElementById('registerView');
    if (isRegistering) {
        signInView.classList.add('hidden');
        registerView.classList.remove('hidden');
    } else {
        registerView.classList.add('hidden');
        signInView.classList.remove('hidden');
    }
}

function toggleChat() {
    const drawer = document.getElementById('chatDrawer');
    drawer.classList.toggle('hidden');
}

// --- LANGUAGE MAPPING DATA ---
const uiTranslations = {
    "English": {
        dashTitle: "Citizen Workspace", dashSub: "Welcome back",
        submitTitle: "Policy Submission", policyPlace: "Enter legal text or policy clause...",
        profilePlace: "Your Profile (e.g. Resident of Karnataka)", submitBtn: "Generate Roadmap",
        resultTitle: "Actionable Roadmap", loadingText: "Parsing Legislation..."
    },
    "Hindi": {
        dashTitle: "नागरिक कार्यक्षेत्र", dashSub: "आपका स्वागत है",
        submitTitle: "नीति प्रस्तुत करें", policyPlace: "कानूनी पाठ या नीति खंड दर्ज करें...",
        profilePlace: "आपका विवरण (जैसे कर्नाटक के निवासी)", submitBtn: "रोडमैप तैयार करें",
        resultTitle: "कार्ययोजना", loadingText: "कानून का विश्लेषण जारी है..."
    },
    "Kannada": {
        dashTitle: "ನಾಗರಿಕ ಕಾರ್ಯಕ್ಷೇತ್ರ", dashSub: "ಸ್ವಾಗತ",
        submitTitle: "ನೀತಿ ಸಲ್ಲಿಕೆ", policyPlace: "ಕಾನೂನು ಪಠ್ಯ ಅಥವಾ ನೀತಿ ನಿಯಮವನ್ನು ನಮೂದಿಸಿ...",
        profilePlace: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ (ಉದಾಹರಣೆಗೆ ಕರ್ನಾಟಕದ ನಿವಾಸಿ)", submitBtn: "ಮಾರ್ಗಸೂಚಿ ರಚಿಸಿ",
        resultTitle: "ಕ್ರಿಯಾ ಯೋಜನೆ", loadingText: "ಶಾಸನವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ..."
    },
    "Tamil": {
        dashTitle: "குடிமக்கள் பணியிடம்", dashSub: "நல்வரவு",
        submitTitle: "கொள்கை சமர்ப்பிப்பு", policyPlace: "சட்ட உரை ಅಥವಾ கொள்கை பிரிவை உள்ளிடவும்...",
        profilePlace: "உங்கள் சுயவிவரம் (எ.கா. கர்நாடக निवासी)", submitBtn: "roadmap உருவாக்கு",
        resultTitle: "செயல்பாட்டு வரைபடம்", loadingText: "சட்டம் பகுப்பாய்வு செய்யப்படுகிறது..."
    },
    "Telugu": {
        dashTitle: "పౌర కార్యస్థలం", dashSub: "స్వాగతం",
        submitTitle: "విధాన సమర్పణ", policyPlace: "చట్టపరమైన వచనం లేదా విధాన నిబంధనను నమోదు చేయండి...",
        profilePlace: "మీ ప్రొఫైల్ (ఉదా. కర్ణాటక నివాసి)", submitBtn: "రోడ్‌మ్యాప్‌ను రూపొందించండి",
        resultTitle: "కార్యాచరణ ప్రణాళిక", loadingText: "చట్టాన్ని విశ్లేషిస్తోంది..."
    }
};

// --- BACKEND CONFIGURATION ---
const BACKEND_URL = "http://127.0.0.1:8000/generate";

// --- EVENT LISTENERS ---

// 1. Language Change
document.getElementById('langSelect').addEventListener('change', () => {
    const lang = document.getElementById('langSelect').value;
    const trans = uiTranslations[lang] || uiTranslations["English"];
    
    document.getElementById('dashTitle').innerText = trans.dashTitle;
    document.getElementById('dashSub').innerText = trans.dashSub;
    document.getElementById('submitTitle').innerText = trans.submitTitle;
    document.getElementById('submitBtn').innerText = trans.submitBtn;
    document.getElementById('resultTitle').innerText = trans.resultTitle;
    document.getElementById('policyInput').placeholder = trans.policyPlace;
    document.getElementById('userProfile').placeholder = trans.profilePlace;
    document.getElementById('loading').innerText = trans.loadingText;
});

// 2. Roadmap Generation
document.getElementById('submitBtn').addEventListener('click', async () => {
    const policy = document.getElementById('policyInput').value;
    const profile = document.getElementById('userProfile').value;
    const timeline = document.getElementById('timelineContainer');
    const loading = document.getElementById('loading');
    const lang = document.getElementById('langSelect').value;

    if (!policy || !profile) return alert("Please fill all fields.");

    loading.classList.remove('hidden');
    timeline.innerHTML = ""; 

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                prompt: `User Profile: ${profile}\nLegal Text: ${policy}`,
                system_prompt: `You are JurisEase. Create a 3-step legal roadmap in ${lang}. Focus on specific legal sections. Use 'Step 1:', 'Step 2:', 'Step 3:' headers.`
            })
        });

        const data = await response.json();
        const content = data.choices[0].message.content;
        const steps = content.split(/Step\s*\d+:|Phase\s*\d+:|\d+\./i).filter(s => s.trim().length > 5);

        steps.slice(0, 3).forEach((text, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'timeline-step';
            stepDiv.style.opacity = "1";
            stepDiv.innerHTML = `
                <div class="step-card">
                    <span class="step-number" style="color:#d4af37; font-weight:800; font-size:0.7rem;">PHASE 0${index + 1}</span>
                    <p style="color:white; margin-top:5px;">${text.trim()}</p>
                </div>`;
            timeline.appendChild(stepDiv);
        });

        document.getElementById('downloadBtn').style.display = 'block';
        document.getElementById('printBtn').style.display = 'block';

    } catch (e) {
        timeline.innerHTML = `<p style="color:#d4af37">Check if main.py is running.</p>`;
    } finally {
        loading.classList.add('hidden');
    }
});

// 3. Clear Form Logic
document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('policyInput').value = "";
    document.getElementById('userProfile').value = "";
    document.getElementById('timelineContainer').innerHTML = '<div id="resultBox" class="roadmap-content">Await results...</div>';
    document.getElementById('downloadBtn').style.display = 'none';
    document.getElementById('printBtn').style.display = 'none';
});

// 4. Archive Display with Copy Feature
async function loadArchive() {
    const timeline = document.getElementById('timelineContainer');
    timeline.innerHTML = "<p>Loading Session Archive...</p>";

    try {
        const response = await fetch("http://127.0.0.1:8000/archive");
        const data = await response.json();
        
        if (data.history.length === 0) {
            timeline.innerHTML = "<p>No previous roadmaps found in this session.</p>";
            return;
        }

        timeline.innerHTML = ""; 
        data.history.forEach((item, index) => {
            const archiveDiv = document.createElement('div');
            archiveDiv.className = 'timeline-step';
            archiveDiv.style.opacity = "1";
            archiveDiv.innerHTML = `
                <div class="step-card" style="border-bottom: 1px solid var(--border); margin-bottom: 20px; padding-bottom: 10px; position: relative;">
                    <span class="step-number" style="color: var(--accent); font-weight: 800;">ARCHIVED QUERY 0${index + 1}</span>
                    <button onclick="navigator.clipboard.writeText(\`${item.result.replace(/`/g, '\\`').replace(/\n/g, ' ')}\`)" 
                            style="position: absolute; right: 0; top: 0; background: none; border: 1px solid var(--accent); color: var(--accent); font-size: 0.5rem; cursor: pointer; padding: 2px 5px;">
                        Copy
                    </button>
                    <p style="color:var(--accent); font-size: 0.75rem; margin-top: 5px;"><b>Context:</b> ${item.query.substring(0, 80)}...</p>
                    <p style="color:white; margin-top:10px; font-size: 0.85rem;">${item.result}</p>
                </div>`;
            timeline.appendChild(archiveDiv);
        });
    } catch (e) {
        timeline.innerHTML = "<p>Could not connect to Archive storage.</p>";
    }
}

document.querySelector('.legal-sidebar nav a:nth-child(2)').onclick = (e) => {
    e.preventDefault();
    loadArchive();
};

// 5. Exports
document.getElementById('downloadBtn').onclick = () => {
    const text = document.getElementById('timelineContainer').innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'LexiGuide_Roadmap.txt';
    link.click();
};

document.getElementById('printBtn').onclick = () => window.print();

// 6. Detailed Chat Interface
document.getElementById('sendChatBtn').addEventListener('click', async () => {
    const input = document.getElementById('chatInput');
    const container = document.getElementById('chatMessages');
    const question = input.value.trim();
    const lang = document.getElementById('langSelect').value;

    if (!question) return;

    container.innerHTML += `<div class="message user">${question}</div>`;
    input.value = "";
    
    const aiMsgId = 'ai-' + Date.now();
    container.innerHTML += `<div id="${aiMsgId}" class="message ai">Consulting Legal Database...</div>`;
    container.scrollTop = container.scrollHeight;

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                prompt: question,
                system_prompt: `You are an expert legal assistant. Provide a highly detailed response in ${lang}, citing specific Acts, Articles, or Sections of Indian Law where relevant.`
            })
        });
        const data = await response.json();
        // Updated to handle formatting and detail
        document.getElementById(aiMsgId).innerHTML = data.choices[0].message.content.replace(/\n/g, '<br>');
    } catch (e) {
        document.getElementById(aiMsgId).innerText = "Backend error. Check terminal.";
    }
    container.scrollTop = container.scrollHeight;
});

document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('sendChatBtn').click();
});

document.getElementById('chatToggle').onclick = toggleChat;