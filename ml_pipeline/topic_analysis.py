import os
import sparknlp
import nltk

nltk.download('stopwords')
from nltk.corpus import stopwords

from pyspark import SparkConf, SparkContext,SQLContext
from pyspark.sql import SparkSession, functions
from pyspark.ml.feature import Word2Vec,CountVectorizer
from pyspark.ml.clustering import LDA, LDAModel
from pyspark.sql.functions import col, udf
from pyspark.sql.types import IntegerType,ArrayType,StringType

from sparknlp.base import DocumentAssembler
from sparknlp.annotator import Tokenizer
from sparknlp.annotator import Normalizer

context = sparknlp.start()
data_path = "gs://6893finalpruv/1.csv" # Data path for csv file
spark_df = spark.read.csv(data_path, inferSchema = True, header=True) # checking the csv file
spark_df.show()

# Topic Modelling on Title (Potentially do it on description if possible)
node = "Title"
# Get title data, filter out empty nodes
title_data = spark_df.select(node).filter(functions.col(node).isNotNull())
