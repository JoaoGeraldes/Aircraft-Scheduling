## Sorting logic

I forced the requests to start at the last offset, because, otherwise we would have to scroll down or fetch more indefinetely.
It would be frustrating for the user to load more results indefinetely trying to find the origin EGKK (our airplane base).
So the order is, prioritized by origin "EGKK" from top to bottom.
Initially I implemented an infinite-scroll (fetch more) to ease the process of fetching more but then I realized that it wouldn't be a good experience since I'm ordering from top to bottom. Therefore, I chose to implement an event trigger to a click of a button rather than scroll event on a div.

The Flights list, will be sorted by origin, based on the destination of the last selected flight in rotation.
e.g.: If the last selected flight in rotation has a destination of EGKK, then, the list will show origins starting at EGKK.

## Load more data

To fetch more flights, scroll down (when scroll is available) or click on the 'Load more' button.

## Final notes

Some environment variables were set on .env file in the root directory.
I added some @types and TypeScript to the project (as dev dependencies) to facilitate typing and avoid errors.
