
async function testWriteOps() {
    console.log("Testing Create Department...");
    const createRes = await fetch('http://localhost:3000/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            dept_name: "Test Dept",
            campus_id: 999,
            description: "Temp description",
            cc_email_to_csv: "test@example.com",
            user_id: 1
        })
    });

    if (!createRes.ok) {
        console.error("Create failed", createRes.status, await createRes.json().catch(() => ({})));
        return;
    }

    const dept = await createRes.json();
    const id = dept.dept_id;
    console.log(`Created Dept ID: ${id}`);

    console.log(`Testing Patch Department ${id}...`);
    const patchRes = await fetch(`http://localhost:3000/api/departments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            dept_name: "Updated Dept",
            campus_id: 888,
            description: "Updated desc",
            cc_email_to_csv: "updated@example.com",
            user_id: 1
        })
    });

    if (!patchRes.ok) {
        console.error("Patch failed", patchRes.status, await patchRes.json().catch(() => ({})));
    } else {
        console.log("Patch Success");
    }

    console.log(`Testing Delete Department ${id}...`);
    const deleteRes = await fetch(`http://localhost:3000/api/departments/${id}`, {
        method: 'DELETE'
    });

    if (!deleteRes.ok) {
        console.error("Delete failed", deleteRes.status, await deleteRes.json().catch(() => ({})));
    } else {
        console.log("Delete Success");
    }
}

testWriteOps();
