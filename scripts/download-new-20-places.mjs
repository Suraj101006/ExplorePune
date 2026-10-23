import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES = [
  {
    id: 'chavand-fort',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Chavand_Fort.jpg/800px-Chavand_Fort.jpg'
  },
  {
    id: 'hadsar-fort',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Hadsar_Fort_Main_Entrance.jpg/800px-Hadsar_Fort_Main_Entrance.jpg'
  },
  {
    id: 'jivdhan-fort',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jivdhan_Fort_and_Vanarlingi_Pinnacle.jpg/800px-Jivdhan_Fort_and_Vanarlingi_Pinnacle.jpg'
  },
  {
    id: 'naneghat-pass-caves',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Naneghat_Toll_Pot.jpg/800px-Naneghat_Toll_Pot.jpg'
  },
  {
    id: 'tulja-caves-junnar',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Tulja_Lena_Cave_3_Chaitya.jpg/800px-Tulja_Lena_Cave_3_Chaitya.jpg'
  },
  {
    id: 'manmodi-caves-junnar',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Manmodi_caves_facade.jpg/800px-Manmodi_caves_facade.jpg'
  },
  {
    id: 'nana-wada',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Nana_Wada_Pune.jpg/800px-Nana_Wada_Pune.jpg'
  },
  {
    id: 'bhandarkar-oriental-research-institute',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Bhandarkar_Oriental_Research_Institute_Pune.jpg/800px-Bhandarkar_Oriental_Research_Institute_Pune.jpg'
  },
  {
    id: 'sangam-ghat-sangameshwar-temple',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sangam_Ghat_Pune.jpg/800px-Sangam_Ghat_Pune.jpg'
  },
  {
    id: 'bharat-itihas-sanshodhak-mandal',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bharat_Itihas_Sanshodhak_Mandal_Pune.jpg/800px-Bharat_Itihas_Sanshodhak_Mandal_Pune.jpg'
  },
  {
    id: 'ojas-ganpati-ozar',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ozar_Ganpati_Temple.jpg/800px-Ozar_Ganpati_Temple.jpg'
  },
  {
    id: 'siddhatek-siddhivinayak-ganpati',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Siddhivinayak_temple_siddhtek.jpg/800px-Siddhivinayak_temple_siddhtek.jpg'
  },
  {
    id: 'banneshwar-temple-nasrapur',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Baneshwar_Temple_Nasrapur.jpg/800px-Baneshwar_Temple_Nasrapur.jpg'
  },
  {
    id: 'katraj-jain-temple-agam-mandir',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Katraj_Jain_Temple_Pune.jpg/800px-Katraj_Jain_Temple_Pune.jpg'
  },
  {
    id: 'sangvi-sangameshwar-temple',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sangameshwar_temple_Old_Sangvi.jpg/800px-Sangameshwar_temple_Old_Sangvi.jpg'
  },
  {
    id: 'blades-of-glory-cricket-museum',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Blades_of_Glory_Cricket_Museum_Pune.jpg/800px-Blades_of_Glory_Cricket_Museum_Pune.jpg'
  },
  {
    id: 'vikram-pendse-cycles-museum',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Vikram_Pendse_Cycle_Museum_Pune.jpg/800px-Vikram_Pendse_Cycle_Museum_Pune.jpg'
  },
  {
    id: 'pune-rail-museum',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Pune_Railway_Station_Heritage.jpg/800px-Pune_Railway_Station_Heritage.jpg'
  },
  {
    id: 'kune-falls-viewpoint',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Kune_Falls_Lonavala.jpg/800px-Kune_Falls_Lonavala.jpg'
  },
  {
    id: 'varasgaon-dam',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Varasgaon_Dam_Water_Reservoir.jpg/800px-Varasgaon_Dam_Water_Reservoir.jpg'
  }
];

const destDir = path.join(process.cwd(), 'public', 'images', 'places');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadImage(imgObj) {
  return new Promise((resolve) => {
    const destPath = path.join(destDir, `${imgObj.id}.jpg`);
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
      console.log(`✓ Already exists: ${imgObj.id}.jpg`);
      return resolve(true);
    }

    const options = {
      headers: {
        'User-Agent': 'ExplorePuneBot/1.0 (https://explorepune.org; contact@explorepune.org) WikimediaFetcher'
      }
    };

    https.get(imgObj.url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, options, (redirectRes) => {
          if (redirectRes.statusCode === 200) {
            const file = fs.createWriteStream(destPath);
            redirectRes.pipe(file);
            file.on('finish', () => {
              file.close();
              console.log(`✓ Downloaded (redirect): ${imgObj.id}.jpg (${fs.statSync(destPath).size} bytes)`);
              resolve(true);
            });
          } else {
            console.warn(`⚠️ Redirect failed for ${imgObj.id} (${redirectRes.statusCode})`);
            resolve(false);
          }
        }).on('error', () => resolve(false));
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${imgObj.id}.jpg (${fs.statSync(destPath).size} bytes)`);
          resolve(true);
        });
      } else {
        console.warn(`⚠️ Download failed for ${imgObj.id} (${res.statusCode})`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.warn(`⚠️ Request error for ${imgObj.id}: ${err.message}`);
      resolve(false);
    });
  });
}

async function main() {
  console.log(`Downloading images for ${IMAGES.length} new authentic Pune places...`);
  for (const img of IMAGES) {
    await downloadImage(img);
  }
  console.log('Done downloading new place images.');
}

main();
