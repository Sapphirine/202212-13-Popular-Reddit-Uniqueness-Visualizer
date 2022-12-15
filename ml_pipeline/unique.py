import os
import nltk

# https://stackoverflow.com/questions/51390676/how-to-visualize-pyspark-mls-lda-or-other-clustering

nltk.download('stopwords')
from nltk.corpus import stopwords

from pyspark import SparkConf, SparkContext,SQLContext
from pyspark.sql import SparkSession, functions
from pyspark.ml.feature import Word2Vec,CountVectorizer,Tokenizer, StopWordsRemover
from pyspark.ml.clustering import LDA, LDAModel
from pyspark.sql.functions import col, udf, countDistinct, regexp_replace
from pyspark.sql.types import IntegerType,ArrayType,StringType
import pandas as pd
import numpy as np
from pyspark.sql.types import DoubleType
from pyspark.sql.functions import lit
import csv

def ith_(v, i):
    try:
        return float(v[i])
    except ValueError:
        return None
spark = SparkSession \
    .builder \
    .appName("Python Spark SQL basic example") \
    .config("spark.driver.memory", "15g") \
    .getOrCreate()
months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
years = ["2015", "2016", "2017", "2018", "2019"]
#months = ["January"]
#years = ["2010"]
for year in years:
    for month in months:
        csv_path = "/" + year + "/" + month + ".csv"
        json_path = "/" + year + "/" + month + ".json"
        data_path = "../data" + csv_path # Data path for csv file
        spark_df = spark.read.csv(data_path, inferSchema = True, header=True) # checking the csv file
        spark_df = spark_df.withColumn('Title', regexp_replace('Title', '"', ''))
        # Topic Modelling on Title (Potentially do it on description if possible)
        node = "Title"
        # Get title data, filter out empty nodes
        title_data = spark_df.select(node).filter(functions.col(node).isNotNull())

        df2 = spark_df.select(countDistinct("Subreddit"))
        topic_num = df2.first()[0]

        tokenizer = Tokenizer(inputCol="Title", outputCol="words")
        tokenized = tokenizer.transform(spark_df)
        remover = StopWordsRemover(stopWords=stopwords.words('english'), inputCol="words", outputCol="filtered")
        result = remover.transform(tokenized)
        # result.select("filtered").show()

        cv = CountVectorizer(inputCol="filtered", outputCol="features")
        cvModel = cv.fit(result)
        cvResult = cvModel.transform(result)

        lda = LDA(maxIter=20, k = topic_num)
        ldaModel = lda.fit(cvResult)
        transformed = ldaModel.transform(cvResult).select("topicDistribution")
        #transformed.show(truncate=False)

        vocab = cvModel.vocabulary
        topics = ldaModel.describeTopics()
        topics_rdd = topics.rdd

        topics_words = topics_rdd\
               .map(lambda row: row['termIndices'])\
               .map(lambda idx_list: [vocab[idx] for idx in idx_list])\
               .collect()
        topic_weights = topics_rdd\
               .map(lambda row: row['termWeights'])\
               .collect()
        '''        file_path = "../unique/processed_data" + csv_path
        if not os.path.exists("../unique/processed_data/" + year):
            os.makedirs("../unique/processed_data/" + year)
        with open(file_path, 'w') as file:
            header = ["term", "probability", "topic"]
            writer = csv.writer(file)
            writer.writerow(header)
            for idx, topic in enumerate(topics_words):
                i = 0
                for word in topic:
                    data = [word, topic_weights[idx][i], idx]
                    writer.writerow(data)
                    i = i+1

        json_df = pd.read_csv(file_path)
        json_df.to_json("../unique/processed_data" + json_path, orient = "table")'''

        dist = ldaModel.transform(cvResult)

        ith = udf(ith_, DoubleType())
        df = dist.select(["Title"] + [ith("topicDistribution", lit(i)).alias('topic_'+str(i)) for i in range(10)] )

        df_p = dist.select('topicDistribution').toPandas()
        df_p1 = df_p.topicDistribution.apply(lambda x:np.array(x))
        df_p2 = pd.DataFrame(df_p1.tolist()).apply(lambda x:x.argmax(),axis=1)
        df_p3 = df_p2.reset_index()
        df_p3.columns = ['doc','topic']
        df2_p = dist.select('Title', "Subreddit").toPandas()
        #print(df_p3)
        final_df = pd.concat([df2_p, df_p3], axis=1)
        final_df = final_df.sort_values(by=['topic', "Subreddit"])
        topic_path = "../unique/document_topics" + csv_path
        if not os.path.exists("../unique/document_topics/" + year):
            os.makedirs("../unique/document_topics/" + year)
        final_df.to_csv(topic_path, index=False)
