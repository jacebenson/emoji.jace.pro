module.exports = async function() {
  const fetch = (await import('node-fetch')).default;
  const url = 'https://unicode.org/Public/emoji/latest/emoji-test.txt';
  
  try {
    console.log('Fetching emoji data from Unicode...');
    const response = await fetch(url);
    const text = await response.text();
    
    const emojis = [];
    const groups = {};
    let currentGroup = '';
    let currentSubgroup = '';
    
    const lines = text.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip empty lines and comments that aren't group/subgroup
      if (!trimmed || trimmed.startsWith('#')) {
        // Check for group definitions
        if (trimmed.startsWith('# group:')) {
          currentGroup = trimmed.replace('# group:', '').trim();
          if (!groups[currentGroup]) {
            groups[currentGroup] = [];
          }
        }
        // Check for subgroup definitions
        else if (trimmed.startsWith('# subgroup:')) {
          currentSubgroup = trimmed.replace('# subgroup:', '').trim();
        }
        continue;
      }
      
      // Parse emoji data lines
      const parts = trimmed.split(';');
      if (parts.length >= 2) {
        const codepoints = parts[0].trim();
        const statusAndName = parts[1].trim();
        
        // Extract status and name
        const statusMatch = statusAndName.match(/^(\S+)\s+#\s*(.+)$/);
        if (statusMatch) {
          const status = statusMatch[1];
          const nameAndVersion = statusMatch[2];
          
          // Only include fully-qualified emojis for main display
          if (status === 'fully-qualified') {
            // Extract emoji character, version, and name
            const nameMatch = nameAndVersion.match(/^(\S+)\s+(E\d+\.\d+)\s+(.+)$/);
            if (nameMatch) {
              const emojiChar = nameMatch[1];
              const version = nameMatch[2];
              const name = nameMatch[3];
              
              const emoji = {
                codepoints,
                char: emojiChar,
                name,
                version,
                status,
                group: currentGroup,
                subgroup: currentSubgroup,
                slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
              };
              
              emojis.push(emoji);
              
              if (currentGroup && groups[currentGroup]) {
                groups[currentGroup].push(emoji);
              }
            }
          }
        }
      }
    }
    
    console.log(`Processed ${emojis.length} emojis in ${Object.keys(groups).length} groups`);
    
    return {
      all: emojis,
      groups,
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error fetching emoji data:', error);
    
    // Return fallback data if fetch fails
    return {
      all: [
        {
          codepoints: '1F600',
          char: '😀',
          name: 'grinning face',
          version: 'E1.0',
          status: 'fully-qualified',
          group: 'Smileys & Emotion',
          subgroup: 'face-smiling',
          slug: 'grinning-face'
        }
      ],
      groups: {
        'Smileys & Emotion': [
          {
            codepoints: '1F600',
            char: '😀',
            name: 'grinning face',
            version: 'E1.0',
            status: 'fully-qualified',
            group: 'Smileys & Emotion',
            subgroup: 'face-smiling',
            slug: 'grinning-face'
          }
        ]
      },
      lastUpdated: new Date().toISOString()
    };
  }
};
