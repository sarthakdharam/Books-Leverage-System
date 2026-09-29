const { AppDataSource } = require('../config/database');
const {AdminRepository}=require('../repositories/admin.repository')
const bcrypt = require('bcrypt');

async function seedAdmin() {
    

    const existingAdmin = await AdminRepository.findOneBy({ username: 'admin' });
    if (existingAdmin) {
        console.log('Admin already exists, skipping seed');
        return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = AdminRepository.create({
        username: 'admin',
        password: "hashedPassword",
    });

    await AdminRepository.save(admin);
    console.log('Admin seeded successfully');
}

module.exports = { seedAdmin };