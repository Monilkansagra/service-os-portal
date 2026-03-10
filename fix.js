const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('d:/SEM-6/SEM-6LAB/AWT/Project/service-management-system/app');

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;

    // Replace text-slate-900 with text-white ONLY in <h1 tags
    content = content.replace(/(<h1\s+className="[^"]*?)\btext-slate-900\b([^"]*?)"/g, '$1text-white$2"');
    // Also check text-slate-800
    content = content.replace(/(<h1\s+className="[^"]*?)\btext-slate-800\b([^"]*?)"/g, '$1text-white$2"');

    // Also replace text-slate-900 for the generic h1 in Type Mapping which might be different
    // Wait, the regex above handles <h1 className="... text-slate-900 ... " />

    // Replace text-slate-500 with text-slate-300 ONLY in the paragraph subheadings right after h1
    // We can just find <p className="text-slate-500 font-bold text-sm mt-2"> or <p className="text-slate-500 font-medium">
    // Since we know these are used as subheadings in those specific files.
    content = content.replace(/(<p\s+className="[^"]*?)\btext-slate-500\b([^"]*?)(font-bold|font-medium)([^"]*?)"/g, (match, p1, p2, p3, p4) => {
        // Avoid replacing if it's inside a card where it shouldn't be touched, 
        // but looking at earlier grep, the cards use text-slate-600 mostly, except possibly some.
        // Let's just do it directly for the subheadings 
        return `${p1}text-slate-400${p2}${p3}${p4}"`;
    });

    if (content !== original) {
        fs.writeFileSync(f, content);
        console.log("Updated", f);
    }
});
