const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const sorted = require("jest-sorted");

const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data");
const articles = require("../db/data/test-data/articles");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  describe("/api", () => {
    test("should respond with a json object with a message key", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body.msg).toBe("all ok");
        });
    });
  });
  describe("/api/topics", () => {
    test("should respond with a json object of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("description", expect.any(String));
            expect(topic).toHaveProperty("slug", expect.any(String));
          });
        });
    });
  });
});

describe("server errors", () => {
  test("responds with 404: Not Found", () => {
    return request(app)
      .get("/api/topicz")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("404 Not Found");
      });
  });
  test("responds with 400: Bad Request", () => {
    return request(app)
      .get("/api/articles/5i")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("400 Bad Request");
      });
  });
});

describe("/api/articles", () => {
  test("should return a sorted array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(Array.isArray(articles)).toBe(true);
      });
  });
  test("should return an array of objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:articles_id", () => {
  test("should respond with article objects", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(3);
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          })
        );
      });
  });
  test("responds with 404 if ID not found", () => {
    return request(app)
      .get("/api/articles/50999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("404 Not Found");
      });
  });
  test("responds with 400 if ID is not valid", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("400 Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should response with 201 status and posted comment object", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject(
          expect.objectContaining({
            article_id: 1,
            author: "butter_bridge",
            body: "This is a new comment",
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });

  test("ignores any unnecessary properties on the Newcomment object", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a new comment",
      random: "ignored"
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject(
          expect.objectContaining({
            article_id: 1,
            author: "butter_bridge",
            body: "This is a new comment",
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });

  test("404 error for non existent ID", () => {
    const Newcomment = {
      username: "butter_bridge",
      body: "This is another comment",
    };
    return request(app)
      .post("/api/articles/500/comments")
      .send(Newcomment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("404 Not Found");
      });
  });

  test("404 error for invalid user", () => {
    const Newcomment = {
      username: "John",
      body: "This is another comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(Newcomment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("404 Not Found");
      });
  });

  test("400 error for invalid article", () => {
    const Newcomment = {
      username: "John",
      body: "This is another comment",
    };
    return request(app)
      .post("/api/articles/5i/comments")
      .send(Newcomment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("400 Bad Request");
      });
  });

  test("400 error for empty username", () => {
    const Newcomment = {
      username: "",
      body: "Just another comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(Newcomment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("400 Bad Request");
      });
  });

  test("400 error for empty username", () => {
    const Newcomment = {
      username: "butter_bridge",
      body: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(Newcomment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("400 Bad Request");
      });
  });
});