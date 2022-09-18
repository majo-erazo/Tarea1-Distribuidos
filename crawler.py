import requests
from bs4 import BeautifulSoup
import psycopg2

conn = psycopg2.connect(database='postgres', user='postgres',password='postgres')

cur = conn.cursor()

def txt_reader(max_lines=None):
    fichero = open('data',"r")
    lines = fichero.readlines()[1:]
    cont = 0

    for line in lines:
        # Interrupe la lectura cuando se alcansa el limite de lineas
        if(cont == max_lines):
            return
        datos = line.split('\t')
        #print(datos)
        if datos[4] == '' and datos[5] == '\n':
            continue
        url = datos[4]

        c_url = url[:-1]
        #print("URL sin salto de linea",c_url)

        info = getInfoURL(c_url)

        if info is not None:
            print(f'[{id}],{info["url"]} \n Title: {repr(info["title"])} \n Description: {repr(info["description"])} \n Keywords: {repr(info["keywords"])}')
            cont += 1
    
    fichero.close()    
    return
#---- Hace scraping para determinar todos los elemntos de la url ----#
def getInfoURL(url):
    
    recoleccion = {'url': url, 'title': None, 'description': None, 'kewords': None}

    try:
        r = requests.get(url, timeout=1)
    except Exception:
        return None
    
    if r.status_code == 200:
        source = requests.get(url).text
        soup = BeautifulSoup(source, features='html.parser')

        meta = soup.find("meta")
        #print(meta)

        title = soup.find('title')
        #print("Titulo ",title, type(title))

        description = soup.find("meta", {'name':"description"})
        #print("Descripcion ",description, type(description))

        keywords = soup.find("meta", {'name': "keywords"})
        #print("Palabra clave ",keywords, type(keywords))

        #Oredena toda la información para que se vea de forma mas ordenada en la BD
        try:
            if keywords is None:
                return None
            else:
                description = description['content'] if description else None
                keywords = keywords['content'] if keywords else None

                keywords = keywords.replace(" ", "") if keywords else None
                keywords = keywords.replace(".", "") if keywords else None
        
        except Exception:
            return None
        
        title = title.get_text().replace("\n","") if title else None
        title = title.replace("\r","") if title else None
        title = title.replace("\t","") if title else None

        recoleccion['title'] = title
        recoleccion['description'] = description
        recoleccion['keywords'] = keywords 
        if recoleccion['keywords'] is None:
                return None


        cur.execute("INSERT INTO link (title, descriptions, keywords, urls) VALUES (%s ,%s, %s, %s)", (str(title), str(description), str(keywords), str(url)))
        conn.commit()

        return None

    return None
                   
txt_reader(5)
