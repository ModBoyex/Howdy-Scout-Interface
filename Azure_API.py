from flask import Flask, jsonify
import pymssql

app = Flask(__name__)

# Configuration for connecting to the SQL Server database
DB_CONFIG = {
		'server': 'sbrondel.database.windows.net',
		'user': 'powerbi',
		'password': 'HowdyStats!',
		'database': 'howdyscout2024',
		'port': 1433,
}

def get_database_connection():
		return pymssql.connect(**DB_CONFIG)

@app.route('/api/data', methods=['GET'])
def get_data():
		try:
				connection = get_database_connection()
				cursor = connection.cursor(as_dict=True)
				cursor.execute('SELECT * FROM YourTableName')
				data = cursor.fetchall()
				return jsonify(data)
		except Exception as e:
				return jsonify({'error': str(e)})

if __name__ == '__main__':
		app.run(debug=True)