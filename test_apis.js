
const apis = [
    'http://localhost:3000/api/departments',
    'http://localhost:3000/api/users',
    'http://localhost:3000/api/requests',
    'http://localhost:3000/api/service-type',
    'http://localhost:3000/api/status-master',
    'http://localhost:3000/api/roles',
    'http://localhost:3000/api/request-types',
    'http://localhost:3000/api/request-reply',
    'http://localhost:3000/api/dept-person',
    'http://localhost:3000/api/status',
    'http://localhost:3000/api/type-mapping'
];

async function testApis() {
    console.log("Starting API Tests...\n");
    for (const api of apis) {
        try {
            const start = Date.now();
            const res = await fetch(api);
            const end = Date.now();
            const status = res.status;
            const data = await res.json();

            const emoji = status === 200 ? "✅" : "❌";
            console.log(`${emoji} ${api.padEnd(50)} | Status: ${status} | Time: ${end - start}ms`);

            if (status !== 200) {
                console.log(`   └─ Error: ${JSON.stringify(data.error || data)}`);
            } else {
                const count = Array.isArray(data) ? data.length : "Object";
                console.log(`   └─ Response: ${count} items returned`);
            }
        } catch (err) {
            console.log(`🚨 FAILED to fetch ${api}: ${err.message}`);
        }
    }
}

testApis();
