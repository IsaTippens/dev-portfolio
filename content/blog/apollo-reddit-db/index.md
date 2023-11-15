---
title: Quick Apollo Backend Breakdown
description: Quick breakdown of the Apollo app's backend code
date: 2023-06-14
published: true
---

In response to Reddit's recent change to API costs, Apollo app's creator has decided to shutdown the app. What also came out of this is the backend code, used for Apollo, being set to [public on github](https://github.com/christianselig/apollo-backend).

I'm interested in how the backend works, so I'm going to try to break it down 😀.

## Go?!

Opening the repository and seeing the code - its all written in golang! Working with golang is fun, but I would love to see industry patterns and practices in action. Also noteworthy is the database being used is Postgresql, also something that I work with. My understanding so far is that this is mainly a middleman between the Reddit API and the Apollo app - possibly caching data to reduce API calls.

![Simplified Apollo backend architecture](/images/svg/apollo.svg)

## Domain Driven Design

It's clear that this is using domain driven design (Model + Domain ⬅ Repository ⬅ Data Source).

The Model represents the table and contains fields to hold the data for that particular table. The Domain is simply interfaces that define actions that can be done on the model, be it fetch, update, create, etc. The Repository is the actual implementation of the Domain interfaces, defining the logic to be done on the data source. The Data source is the actual database, in this case Postgresql or even mock data. This pattern allows for an easy and modular way to swap out how where and how we get our data without having to change the code used by other parts of the application - such as the api code.

## Subreddit usecase

Let's look at the subreddit implementation. Both the domain and model is defined in [domain/subreddit.go](https://github.com/christianselig/apollo-backend/blob/main/internal/domain/subreddit.go) and the repository in [repository/postgres_subreddit.go](https://github.com/christianselig/apollo-backend/blob/main/internal/repository/postgres_subreddit.go).

The subreddit model contains fields it needs to store the data from the database. The domain interface defines the actions that can be done on the model, such as fetching by id or name, and creating or updating a subreddit.

```go
type Subreddit struct {
	ID          int64
	NextCheckAt time.Time
	SubredditID string
	Name        string
}
```

```go
type SubredditRepository interface {
	GetByID(ctx context.Context, id int64) (Subreddit, error)
	GetByName(ctx context.Context, name string) (Subreddit, error)

	CreateOrUpdate(ctx context.Context, sr *Subreddit) error
}
```

I'll assume postgres is being used since the repository implementing the logic is called 'postgresSubredditRepository'. All of the domain interface's methods are implemented, however this is a private struct so it can't be used outside of the package. We see that a method called NewPostgresSubreddit accepts a connection object and returns the domain interface, but, using polymorphism, we can return the repository struct. This way, a different repository can use a different data source, such as a mock database for testing, and the rest of the application works as normal as long as the domain definition is the same.

```go
type postgresSubredditRepository struct {
	conn Connection
}

func NewPostgresSubreddit(conn Connection) domain.SubredditRepository {
	return &postgresSubredditRepository{conn: conn}
}
```

This can all be neatly presented with a UML diagram :)

![Subreddit UML](/images/svg/apollo-subreddit.svg)

## Final thoughts

This entire repository looks really clean. It's really easy to understand whats going on everywhere. I'm excited to try out this pattern in my own work, this was a great learning experience throughout 😄.

## Acknowledgements

[Christian Selig](https://twitter.com/ChristianSelig) - the creator of Apollo app
