API overview
============

## Methods

### Visitor Counter

#### Fetching visitor counter:

    GET /api/visitors

Returns a number as visitor counter

#### Updating visitor counter

    POST /api/visitors

Returns updated visitor counter

### Gameplay Counter

#### Fetching gameplay counter:

    GET /api/gameplays

Returns a number as gameplay counter

#### Updating gameplay counter

    POST /api/gameplays

Returns updated gameplay counter

### Ranking

#### Uploading a new score

    POST /api/rank

Request body:

| Field          | Description                               | Optional   |
| -------------- | ----------------------------------------- | ---------- |
| `score` | A number as user's new accquired score | no        |

Returns:

    {
        "rank": This will be user's rank if he/she reaches top 3. Otherwise this is -1
        "diff": (Optional) How many more score user needs to reach top 3 if he/she is not top 3 
        "img":  Link to score image
    }

## Special Entry

### Score Image

    GET /score/{score}/{diff}

Auto generates an image containing user's rank and score.