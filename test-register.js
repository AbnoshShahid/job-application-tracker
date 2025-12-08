
async function testRegister() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Verify User',
                email: 'verify' + Date.now() + '@example.com',
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Body:', data);
    } catch (err) {
        console.error('Error:', err);
    }
}

testRegister();
