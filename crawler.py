import requests
from bs4 import BeautifulSoup
import psycopg2

# Hace la conección con la DataBase
conn = psycopg2.connect(database='postgres', user='postgres',password='postgres')

cur = conn.cursor()

# Lee el archivo de QueryLogs
def txt_reader():
    fichero = open('tarea1/test.txt',"r")
    lines = fichero.readlines()[1:]

    for line in lines:
        datos = line.split('\t')
        #print(datos)
        if datos[4] == '' and datos[5] == '\n':
            continue
        url = datos[4]

        c_url = url[:-1]
        #print("URL sin salto de linea",c_url)
        info = getInfoURL(c_url)
    fichero.close()    
    return
#---- Hace scraping para determinar todos los elemntos de la url ----#
def getInfoURL(url): 
    recoleccion = {'url': url, 'title': None, 'description': None, 'kewords': None}

    try:
        r = requests.get(url, timeout=1)
    except Exception:
        return None
    
    # Verifica si el enlace es funcional
    if r.status_code == 200:
        source = requests.get(url).text
        soup = BeautifulSoup(source, features='html.parser')

        meta = soup.find("meta")
        #print(meta)
        title = soup.find('title')
        #print("Titulo ",title, type(title)
        description = soup.find("meta", {'name':"description"})
        #print("Descripcion ",description, type(description))

        keywords = soup.find("meta", {'name': "keywords"})
        #print("Palabra clave ",keywords, type(keywords))
        

        #Inserta la información de la URL en la DataBase
        cur.execute("INSERT INTO link (title, descriptions, keywords, urls) VALUES (%s ,%s, %s, %s)", (str(title), str(description), str(keywords), str(url)))
        conn.commit()
        
        
txt_reader()
