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
  test("responds with 404: not found", () => {
    return request(app)
      .get("/api/topicz")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("404 Not Found");
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
  test('should return an array of objects', () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      articles.forEach((article)=> {
        expect(article).toEqual(expect.objectContaining( {
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
        )
      })
    })
  });
});

