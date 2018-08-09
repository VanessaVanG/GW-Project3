
# coding: utf-8

# In[1]:


#dependencies
import pymongo
import re
import pandas as pd

from geotext import GeoText

names = ['NewRepublic', 'MotherJones', 'Slate', 'Intercept', 'DailyBeast', 'Atlantic', 'Politico', 'Guardian', 'NewYorkTimes', 'WashingtonPost']

for name in names:
# In[2]:


    #set up the names
    news_site = f'L-{name}3'

    country_csv_path = f'../output/{news_site}_country.csv'
    city_csv_path = f'../output/{news_site}_city.csv'


    # In[3]:


    #set up mongodb connection
    conn = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(conn)


    # In[4]:


    #choose the db
    db = client[news_site]


    # In[5]:


    #chose the HTML_pages
    documents = db.HTML_pages.find()


    # In[6]:


    #set up the lists
    countries_list = []
    cities_list = []


    # In[7]:


    #read in the stopwords file and prepare for regex
    with open('../resources/map_stopwords.txt') as open_file:
        stopwords = open_file.read()  
        
    stopwords_list = stopwords.splitlines()

    stopwords = '|'.join(stopwords_list)


    # In[8]:


    #read in the replacements file and prepare for regex
    map_dict = {}
    with open("../resources/map_replacements.txt") as file:
        for line in file:
            k, v = line.split(': ')
            map_dict[k] = v.rstrip()


    # In[9]:


    #make regex patterns
    remove_pattern = re.compile(fr'{stopwords}')
    replace_pattern = re.compile(r'|'.join(re.escape(key) for key in map_dict.keys()))


    # In[10]:


    #loop through the documents
    for i in range(0, documents.count()):
        text = documents[i]['meta']['text']
        
        #remove stop words
        text_removed = re.sub(remove_pattern, '', text)
        
        #make word replacements
        text_filtered = replace_pattern.sub(lambda x: map_dict[x.group()], text_removed)
        
        #GeoText makes an ordered dict w/ all the country mentions and count
        countries_gt = GeoText(text_filtered).country_mentions
        
        #add to the countries_list
        countries_list.append(countries_gt)  
        
        #get the American cities list
        cities_gt = GeoText(text_filtered, country='US').cities
        
        #put in a set (no dupes)
        cities_set = set(cities_gt)
        
        #make a dictionary where values are 1
        cities_dict = {}
        for city in cities_set:
            cities_dict[city] = 1
            
        #add to the cities list    
        cities_list.append(cities_dict)


    # In[11]:


    #make dataframes from the lists
    countries_df = pd.DataFrame(countries_list)
    cities_df = pd.DataFrame(cities_list)


    # In[12]:


    countries_df.head()


    # In[13]:


    cities_df.head()


    # In[14]:


    cities_df.shape


    # In[15]:


    #drop ' Do' column
    countries_df.drop(' Do', axis=1, inplace=True, errors='ignore')
    countries_df.shape


    # In[16]:


    #get a count of all countries and cities
    countries_series = countries_df.count()
    cities_series = cities_df.count()


    # In[17]:


    #make dataframes w/ a count column
    country_count_df = countries_series.to_frame(name='Count')
    city_count_df = cities_series.to_frame(name='Count')
    country_count_df.head()


    # In[18]:


    #Get the count total
    country_total = country_count_df.sum(axis=0)
    city_total = city_count_df.sum(axis=0)

    #pull out the actual number
    city_total = city_total.iloc[0]
    country_total = country_total.iloc[0]


    # In[19]:


    #make dataframes w/ each city/country percentage of total and sort descending
    country_count_df['Percentage'] = [(row/country_total) * 100 for row in country_count_df['Count']]
    country_count_df.sort_values(by=['Count'], ascending=False, inplace=True)

    city_count_df['Percentage'] = [(row/city_total) * 100 for row in city_count_df['Count']]
    city_count_df.sort_values(by=['Count'], ascending=False, inplace=True)


    # In[22]:


    #export to csv
    country_count_df.to_csv(country_csv_path)
    city_count_df.to_csv(city_csv_path)

