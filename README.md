# STIT-Backend

## Running Instructions

- Clone the repo - `git clone https://github.com/ExC0d3/STIT-Backend.git`
- cd into the cloned directory
- run `npm install`
- run `npm run dev`

## Info

Based on /events API provided by STIT challenge.
Events are generated based on user preferences in a random fashion.
If you get an empty response, it's because the combination of genreId's and
classificationName is returning an empty response from /events Api.
The solution would be to refresh a few times and add more preferences to your
user.
