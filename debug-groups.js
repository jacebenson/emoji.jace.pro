const emojis = require('./src/_data/emojis.js');

async function debugGroups() {
    const data = await emojis();
    console.log('Emoji groups:');
    Object.keys(data.groups).forEach((groupName, index) => {
        console.log(`${index + 1}. "${groupName}" - ${data.groups[groupName].length} emojis`);
        console.log(`   Slug: ${groupName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`);
    });
}

debugGroups();
