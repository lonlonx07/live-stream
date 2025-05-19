import math

class strg_class:
    con = ""

    def __init__(self, con) -> None:
        self.unlocked = True
        self.con = con

        self.db_fields = {}
        self.query_lib = {}
        tbl_fields = "romaji,hiragana,meaning,level"
        self.db_fields['tbl_grammar'] = tbl_fields.split(',')
        self.query_lib['tbl_grammar'] = f"({tbl_fields})"
        self.tbl_profiles_fields = tbl_fields

        tbl_fields = "kanji,onyomi,kunyomi,romaji,meaning,strokes_count,level"
        self.db_fields['tbl_kanji'] = tbl_fields.split(',')
        self.query_lib['tbl_kanji'] = f"({tbl_fields})"
        self.tbl_settings_fields = tbl_fields

        tbl_fields = "romaji,english,hira_kata,kanji,others,status"
        self.db_fields['tbl_vocabs'] = tbl_fields.split(',')
        self.query_lib['tbl_vocabs'] = f"({tbl_fields})"
        self.tbl_settings_fields = tbl_fields

    def get_fields_inarray(self, ind):
        res = ""
        for item in self.db_fields[ind]:
            res += f",{item} TEXT NOT NULL"
        
        return res
        
    def create_tables(self):
        cur = self.con.cursor()
        new_table = False

        try:
            fields = self.get_fields_inarray("tbl_grammar")
            cur.execute(f"CREATE TABLE tbl_grammar (id INTEGER PRIMARY KEY {fields})")
            new_table = True
        except:
            pass

        try:
            fields = self.get_fields_inarray("tbl_kanji")
            cur.execute(f"CREATE TABLE tbl_kanji (id INTEGER PRIMARY KEY {fields})")
            new_table = True
        except:
            pass

        try:
            fields = self.get_fields_inarray("tbl_vocabs")
            cur.execute(f"CREATE TABLE tbl_vocabs (id INTEGER PRIMARY KEY {fields})")
            new_table = True
        except:
            pass

        if self.unlocked and new_table:
            print("Commit")
            self.con.commit()

        return 0
    
    def get_query_single_data(self, table, fields, join, condition):
        sql = f"""SELECT 
                          {fields} 
                          FROM 
                          {table} 
                          {join} 
                          WHERE 
                          {condition}
                        """
        cur = self.con.cursor()
        res = cur.execute(sql)
        row = res.fetchone()
        #print(sql)
        #self.con.close()
        return row
    
    def get_query_data(self, table, fields, join, condition, sorting):
        sql = f"SELECT {fields} FROM {table} {join} WHERE {condition} {sorting}"
        #print(sql)
        cur = self.con.cursor()
        res = cur.execute(sql)
        row = res.fetchall()
        #self.con.close()
        return row
    
    def insert_query(self, tbl, val):
        sql = f"INSERT INTO {tbl} {self.query_lib[tbl]} VALUES {val}"
        #print(sql)
        cur = self.con.cursor()
        cur.execute(sql)
        
        if self.unlocked:
            self.con.commit()
            #return cur.lastrowid

    def update_query(self, tbl, val, condition):
        sql = f"UPDATE {tbl} SET {val} WHERE {condition}"
        #print(sql)
        cur = self.con.cursor()
        cur.execute(sql)
        
        if self.unlocked:
            self.con.commit()

    def delete_query(self, tbl, condition):
        sql = f"DELETE FROM {tbl} WHERE {condition}"
        #print(sql)
        cur = self.con.cursor()
        cur.execute(sql)
        
        if self.unlocked:
            self.con.commit()

    def close_database(self):
        #self.con.execute("VACUUM")
        self.con.close()