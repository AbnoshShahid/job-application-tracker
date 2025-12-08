
const fs = require('fs');
const path = require('path');

async function testResumeUpload() {
    try {
        // Minimal PDF content (Header + body)
        // This is a very crude PDF, but pdf-parse might accept it if it's valid enough.
        // Actually, let's just make a text file disguised as PDF? No, pdf-parse needs PDF structure.
        // Let's try to create a proper minimal PDF buffer.

        const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 200 >>
stream
BT
/F1 12 Tf
100 700 Td
(Contact: john.doe@example.com | 123-456-7890) Tj
0 -20 Td
(Experience) Tj
0 -20 Td
(5 years as Senior Solution Architect) Tj
0 -20 Td
(Worked for TechGlobal Inc.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000060 00000 n
0000000117 00000 n
0000000244 00000 n
0000000318 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
412
%%EOF`;

        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const formData = new FormData();
        formData.append('file', blob, 'resume.pdf');

        console.log('Sending request to http://localhost:3000/api/parse-resume...');
        const res = await fetch('http://localhost:3000/api/parse-resume', {
            method: 'POST',
            body: formData
        });

        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Response:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testResumeUpload();
