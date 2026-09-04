require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
const TalentProfile = require('../models/TalentProfile');
const Application = require('../models/Application');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Seeding...');

  await User.deleteMany();
  await Property.deleteMany();
  await TalentProfile.deleteMany();
  await Application.deleteMany();

  // Users
  const passwords = 'Password123!';

  const landlord1 = await User.create({ name: 'Ada Obi', email: 'ada.obi@landlord.ng', password: passwords, role: 'LANDLORD' });
  const landlord2 = await User.create({ name: 'Tunde Bakare', email: 'tunde.bakare@landlord.ng', password: passwords, role: 'LANDLORD' });
  const landlord3 = await User.create({ name: 'Ngozi Okonkwo', email: 'ngozi@landlord.ng', password: passwords, role: 'LANDLORD' });

  const talent1 = await User.create({ name: 'Chidi Okafor', email: 'chidi@talent.ng', password: passwords, role: 'TALENT' });
  const talent2 = await User.create({ name: 'Funmi Adeyemi', email: 'funmi@talent.ng', password: passwords, role: 'TALENT' });
  const talent3 = await User.create({ name: 'Ibrahim Musa', email: 'ibrahim@talent.ng', password: passwords, role: 'TALENT' });
  const talent4 = await User.create({ name: 'Zainab Balogun', email: 'zainab@talent.ng', password: passwords, role: 'TALENT' });
  const talent5 = await User.create({ name: 'Emeka Nwosu', email: 'emeka@talent.ng', password: passwords, role: 'TALENT' });

  // Talent profiles
  await TalentProfile.create([
    { userId: talent1._id, profession: 'Photographer', bio: 'Lagos-based photographer with 5 years experience.', skills: ['Portrait', 'Event', 'Landscape'], location: 'Surulere, Lagos', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg', availability: true },
    { userId: talent2._id, profession: 'Fashion Designer', bio: 'Creative designer specialised in modern African wear.', skills: ['Ankara', 'Tailoring', 'Style consultancy'], location: 'Ikeja, Lagos', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg', availability: true },
    { userId: talent3._id, profession: 'Software Developer', bio: 'Full-stack developer building impactful applications.', skills: ['JavaScript', 'React', 'Node.js'], location: 'Gbagada, Lagos', avatarUrl: 'https://randomuser.me/api/portraits/men/64.jpg', availability: true },
    { userId: talent4._id, profession: 'Content Writer', bio: 'SEO writer and blogger. I tell stories that convert.', skills: ['Blogging', 'SEO', 'Copywriting'], location: 'Abuja, Nigeria', avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg', availability: true },
    { userId: talent5._id, profession: 'Makeup Artist', bio: 'Professional MUA for weddings and events.', skills: ['Bridal', 'Editorial', 'Beauty'], location: 'Yaba, Lagos', avatarUrl: 'https://randomuser.me/api/portraits/men/85.jpg', availability: false },
  ]);

  // Properties
  const property1 = await Property.create({
    landlordId: landlord1._id,
    title: 'Cozy Studio in Yaba',
    location: 'Yaba, Lagos',
    price: 150000,
    type: 'Studio',
    description: 'Modern studio near Unilag, all bills inclusive. Perfect for young professionals.',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'],
  });
  const property2 = await Property.create({
    landlordId: landlord1._id,
    title: '2-Bedroom Apartment in Lekki',
    location: 'Lekki Phase 1, Lagos',
    price: 1000000,
    type: '2 Bedrooms',
    description: 'Spacious 2-bedroom in a gated estate with 24/7 security.',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80'],
  });
  const property3 = await Property.create({
    landlordId: landlord2._id,
    title: 'Self Contain in Surulere',
    location: 'Surulere, Lagos',
    price: 80000,
    type: 'Self Contain',
    description: 'Furnished room with private bathroom and kitchenette.',
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80'],
  });
  const property4 = await Property.create({
    landlordId: landlord2._id,
    title: '1-Bedroom Flat in Abuja',
    location: 'Wuse 2, Abuja',
    price: 300000,
    type: '1 Bedroom',
    description: 'Beautifully finished flat in the heart of Abuja.',
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80'],
  });
  const property5 = await Property.create({
    landlordId: landlord3._id,
    title: 'Studio Apartment in Ibadan',
    location: 'Bodija, Ibadan',
    price: 120000,
    type: 'Studio',
    description: 'Brand new studio with water heater. Close to Bodija market.',
    images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80'],
  });
  const property6 = await Property.create({
    landlordId: landlord3._id,
    title: '3-Bedroom Terrace in Port Harcourt',
    location: 'GRA, Port Harcourt',
    price: 900000,
    type: '3 Bedrooms',
    description: 'Family home with generator backup and solar.',
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80'],
  });

  // Applications
  await Application.create([
    { talentId: talent1._id, propertyId: property1._id, status: 'APPROVED' },
    { talentId: talent2._id, propertyId: property1._id, status: 'PENDING' },
    { talentId: talent3._id, propertyId: property2._id, status: 'PENDING' },
    { talentId: talent4._id, propertyId: property3._id, status: 'REJECTED' },
    { talentId: talent5._id, propertyId: property3._id, status: 'PENDING' },
    { talentId: talent1._id, propertyId: property5._id, status: 'PENDING' },
  ]);

  console.log('Seed complete!');
  process.exit(0);
};

seed();
