const { pool } = require('./db/connection');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🚀 开始初始化数据库...\n');

    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📝 执行 schema.sql...');
    await pool.query(schema);

    console.log('\n✅ 数据库初始化成功！');
    console.log('\n📊 已创建表：');
    console.log('  - users');
    console.log('  - verification_codes');
    console.log('  - verification_attempts');
    console.log('  - pc_components');

    // 验证表是否存在
    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    console.log('\n✓ 数据库中的表：');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('\n❌ 数据库初始化失败：');
    console.error(error.message);
    process.exit(1);
  }
}

initializeDatabase();
