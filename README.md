
# Cron-job (data handling and DB crud operations)

The Crypto Coin Data Cron Job automates the process of fetching cryptocurrency data and storing it in a Mongo atlas instance. This allows for the automatic updating of cryptocurrency data without manual intervention.

Two cronjobs were created;

1) With a short interval, to regularly update coin price for live updates.

2) With a longer interval, to update, store and fetch data of past 12 hrs (deletes documents older than 12hrs)
