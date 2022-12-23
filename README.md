# PRUV - Popular Reddit Uniqueness Visualization
## Scraper
In the scraper directory there are two scrapers: scraper.py which uses PRAW and scraper2.py which uses HTMLsessions to scrape the data.  Either can be used to pull data similar to the way that was done for this project, but scraper2 is what was used for the bulk of the data.  Both scrapers require the pandas library and the first scraper requires praw.  These were run in Python 3.8.10.

## Scraped Data
The data that was collected can be found in the data directory and is organized by year and month.  Each folder in the data directory corresponds to a year and the posts are aggregated into files based on month within each directory.  This data can be used for whatever purpose.

## Machine Learning Pipeline
There are a few jupyter notebooks that were used to collect statistics about the data and process the post values into information useful for visualization.  In the ml_pipeline directory the main processing occurred in the Scriped_ml_pipeline.ipynb file since it was designed to run through each file individually and process the data into topics for each month.  THe precursor to this file, ml_pipeline.ipynb, can also be seen which does essentially the same thing just in blocks so this was a way to visualize the data as it was running but it wasn't designed to run for the entire dataset.  There is also basic_data.ipynb which aggregated the counts for upvotes and comments to be displayed in line graph form.  These can all be run by a user either in GCP or locally so long as the python package requirements are met.  These scripts require: nltk, pyspark, and pandas.  These scripts were also run with Python 3.8.10.

## Processed Data
Rather than running the machine learning pipeline the processed data has also been uploaded both for the ease of running the visualization to avoid CORS issues and so that others can easily replicate the exact results that were achieved since LDA clustering will ahve differing results on each run.  This data can be found in the processed_data and unique directories.

## Visualization (docs)
The visualization can be run locally with the docs folder as index.html is the main page that is used.  From that page, the other html pages can be found by clicking the total votes, total comments, or error text to bring a user to the other line graphs.  In order to see the visualization a user can cick along the slider to move between months and years to see the data change on visualization.  One important thing to note is that there were issues when trying to vew the visualization in firefox, but it works correctly in chrome.  THe visualization is also hosted publicly at [Visualization](https://danmao124.github.io/pruv) so it is not necessary to run the visualization locally.
