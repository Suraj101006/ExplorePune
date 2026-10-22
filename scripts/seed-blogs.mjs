import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from './load-env.mjs';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SAMPLE_BLOGS = [
  {
    id: 'sinhagad-monsoon-trek-guide',
    slug: 'sinhagad-monsoon-trek-guide',
    title: 'Sunrise Trek to Sinhagad Fort & Steaming Pitla Bhakri',
    author_id: 'community_guide',
    author_name: 'Tanmay Kulkarni',
    place_id: 'sinhagad-fort',
    place_name: 'Sinhagad Fort',
    tags: ['Trekking', 'Sahyadri', 'Food', 'Monsoon'],
    is_draft: false,
    status: 'published',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    content: `Sinhagad (The Lion’s Fort) stands majestically at 1,312 meters above sea level, guarding the southern approaches to Pune. For every Punekar, an early morning trek to Sinhagad is a rite of passage.

### Starting Early from Aatekar Vasti
We started from Pune city at 5:15 AM to reach the base village of Donje before sunrise. The morning breeze in the Sahyadris was crisp, and the trail from Aatekar Vasti takes about 1 hour and 15 minutes of steady climbing. 

The stone path winds upward through dense foliage, with breathtaking vistas of the Khadakwasla backwaters opening up behind you as you ascend.

### Reaching Pune Darwaza & Tanaji's Memorial
Entering through the ancient Pune Darwaza, you immediately feel the weight of Maratha history. This is where Tanaji Malusare fought valiantly in the historic Battle of 1670. Visiting the Tanaji Smarak and Kalyan Darwaza facing the valley is deeply moving.

### The Legendary Breakfast
No Sinhagad expedition is complete without the famous village breakfast served on the plateau:
- Freshly baked **Jowar & Bajra Bhakri** with smoky Thecha (crushed green chilies and garlic)
- Piping hot **Pitla** (spiced gram flour curry)
- Fresh clay pot **Matka Dahi** (thick curd) topped with sugar
- Sweet **Kanda Bhaji** and ginger tea

### Practical Tips
- **Best time to start:** 5:30 AM to beat the mid-day sun.
- **Footwear:** Trekking shoes with good grip are essential, especially during or just after rains.
- **Water:** Carry at least 1.5 liters, though drinking water is available at the top.
`
  },
  {
    id: 'heritage-walk-old-pune-peshwas',
    slug: 'heritage-walk-old-pune-peshwas',
    title: 'Walking Through 300 Years of History: The Old Pune Peth Trail',
    author_id: 'community_guide',
    author_name: 'Radhika Joshi',
    place_id: 'shaniwar-wada',
    place_name: 'Shaniwar Wada',
    tags: ['Heritage', 'Architecture', 'Culture', 'Walks'],
    is_draft: false,
    status: 'published',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    published_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    content: `Pune’s old city—divided into historical "Peths" named after days of the week—is an open-air museum of Maratha architecture, vibrant bazaars, and sacred shrines.

### Stop 1: Shaniwar Wada & Dilli Darwaza
Our self-guided walking tour began at 9:00 AM at **Shaniwar Wada**, the seat of the Peshwa prime ministers built in 1732. Standing before the monumental Dilli Darwaza with its mammoth steel spikes (designed to ward off war elephants) is awe-inspiring. Inside, the foundation fountains, gardens, and remnants of the seven-storey palace whisper centuries of valor and intrigue.

### Stop 2: Lal Mahal
A 3-minute stroll across the street brought us to **Lal Mahal**, where Chhatrapati Shivaji Maharaj spent his formative childhood years with his mother Rajmata Jijau. The museum displays intricate murals depicting the legendary confrontation with Shaista Khan.

### Stop 3: Kasba Ganpati & Tambat Ali
Next, we offered prayers at **Kasba Ganpati**, the Gramdaivata (presiding deity) of Pune established in 1630. From there, we wandered into **Tambat Ali** (Coppersmiths’ Lane), where fourth-generation artisans still handcraft gleaming copper and brass water vessels with melodic rhythmic hammering.

### Stop 4: Tulshibaug & Vishrambaug Wada
We concluded at **Vishrambaug Wada**, an architectural jewel built by Bajirao II in 1807, famed for its carved wooden pillars, cypress-shaped motifs, and ornate teak balconies.

**Duration:** Approx 3 hours at an easy walking pace.
`
  },
  {
    id: 'pataleshwar-hidden-rock-cut-temple',
    slug: 'pataleshwar-hidden-rock-cut-temple',
    title: 'Pataleshwar: The 8th-Century Monolithic Temple Carved in Basalt',
    author_id: 'community_guide',
    author_name: 'Vikram Shinde',
    place_id: 'pataleshwar-caves',
    place_name: 'Pataleshwar Cave Temple',
    tags: ['Architecture', 'Temples', 'History', 'Hidden Gems'],
    is_draft: false,
    status: 'published',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    published_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    content: `Right in the middle of modern Pune’s bustling Jangali Maharaj Road lies one of the city’s best-kept archaeological wonders: the 8th-century **Pataleshwar Cave Temple**.

Carved out of a single monolithic basalt rock during the Rashtrakuta dynasty, the cave temple is subterranean (hence the name *Pataleshwar* — God of the Underworld).

### The Circular Nandi Mandapa
As you descend the stone steps, the street noise of Pune abruptly fades away into serene silence. The centerpiece of the complex is the striking circular **Nandi Mandapa** supported by massive monolithic stone pillars. The symmetry and precision executed over 1,200 years ago with simple chisels is breathtaking.

### The Inner Sanctum
Inside the cool pillared hall sits the Shiva Lingam, worshipped daily with fresh bel leaves and flowers. The air is remarkably cool even on hot afternoons, naturally insulated by meters of volcanic basalt rock.

### Visitor Notes
- **Entry:** Free admission for all visitors.
- **Timings:** Open daily 8:30 AM to 5:30 PM.
- **Nearby:** Directly opposite are some of Pune’s most beloved cafes on FC Road.
`
  }
];

async function seedBlogs() {
  console.log('Seeding sample travel blogs into Firestore...');
  for (const b of SAMPLE_BLOGS) {
    await setDoc(doc(db, 'blogs', b.id), b);
    console.log(`Seeded blog: ${b.title}`);
  }
  console.log('Blogs seeded successfully!');
  process.exit(0);
}

seedBlogs().catch((err) => {
  console.error('Error seeding blogs:', err);
  process.exit(1);
});
