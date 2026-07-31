import mysql from 'mysql2/promise'

async function main() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'mdt',
    port: 3306,
  })

  try {
    const [rows] = await connection.execute('SELECT * FROM integrations')
    console.log('Integrations:', rows)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await connection.end()
  }
}

main()
