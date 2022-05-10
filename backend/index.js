require('dotenv').config();
const neo4j = require('neo4j-driver');
const { gql, ApolloServer } = require("apollo-server");
const { Neo4jGraphQL } = require("@neo4j/graphql");


NEO4J_HOST = process.env.NEO4J_HOST
NEO4J_USER = process.env.NEO4J_USER
NEO4J_PASS = process.env.NEO4J_PASS
const driver = neo4j.driver(NEO4J_HOST, neo4j.auth.basic(NEO4J_USER, NEO4J_PASS))
const typeDefs = gql`
interface ActedInProperties @relationshipProperties {
    roles: [String]!
  }
  
  type Movie {
    peopleActedIn: [Person!]!
      @relationship(
        type: "ACTED_IN"
        direction: IN
        properties: "ActedInProperties"
      )
    peopleDirected: [Person!]! @relationship(type: "DIRECTED", direction: IN)
    peopleProduced: [Person!]! @relationship(type: "PRODUCED", direction: IN)
    peopleReviewed: [Person!]!
      @relationship(
        type: "REVIEWED"
        direction: IN
        properties: "ReviewedProperties"
      )
    peopleWrote: [Person!]! @relationship(type: "WROTE", direction: IN)
    released: BigInt!
    tagline: String
    title: String!
  }
  
  type Person {
    actedInMovies: [Movie!]!
      @relationship(
        type: "ACTED_IN"
        direction: OUT
        properties: "ActedInProperties"
      )
    born: BigInt
    directedMovies: [Movie!]! @relationship(type: "DIRECTED", direction: OUT)
    followsPeople: [Person!]! @relationship(type: "FOLLOWS", direction: OUT)
    name: String!
    peopleFollows: [Person!]! @relationship(type: "FOLLOWS", direction: IN)
    producedMovies: [Movie!]! @relationship(type: "PRODUCED", direction: OUT)
    reviewedMovies: [Movie!]!
      @relationship(
        type: "REVIEWED"
        direction: OUT
        properties: "ReviewedProperties"
      )
    wroteMovies: [Movie!]! @relationship(type: "WROTE", direction: OUT)
  }
  
  interface ReviewedProperties @relationshipProperties {
    rating: BigInt!
    summary: String!
  }
`;

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
    const server = new ApolloServer({
        schema
    });
    var port = process.env.PORT || 4000;
    server.listen(port).then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
  })
  