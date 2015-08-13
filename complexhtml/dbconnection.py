import MySQLdb
 

class mysql:

	def __init__(self, db_host, db_port, db_name, db_user, db_pass):
		self.db_host = db_host
		self.db_port = db_port
		self.db_name = db_name
		self.db_user = db_user
		self.db_pass = db_pass
		self.access = None

	def connection(self):
		if self.access == None:
			self.access = MySQLdb.connect(host=self.db_host, user=self.db_user, passwd=self.db_pass, db=self.db_name, charset='utf8', use_unicode=1)
	
	def query(self, query):
		self.connection()
		self.cursor = self.access.cursor()
		self.execute = self.cursor.execute(query)
		return self.execute

	def numberofrows(self):
		return self.cursor.rowcount

	def fetchall(self):
		return self.cursor.fetchall()

	def showconfig(self):
		result = "db_host : %s" % (self.db_host)
		result += "db_name : %s" % (self.db_name)
		result += "db_user : %s" % (self.db_user)
		result += "db_pass : %s" % (self.db_pass)
		return result

	def disconnect(self):
		self.access.close()
