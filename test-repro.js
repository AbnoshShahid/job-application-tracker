
async function testRepro() {
    const randomEmail = 'debug' + Date.now() + '@yahoo.com';
    console.log(`Testing registration with ${randomEmail}...`);
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Debug User',
                email: randomEmail,
                password: 'password123'
            })
        });

        console.log('Status code:', response.status);
        const data = await response.json();
        console.log('Body:', data);
    } catch (err) {
        console.error('Error:', err);
    }
}

testRepro();
