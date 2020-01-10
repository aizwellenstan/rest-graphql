const graphql = require("graphql");
const Attribute = require("../models/attribute");
const Author = require("../models/historical");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const AttributeType = new GraphQLObjectType({
  name: "Attribute",
  fields: () => ({
    id: { type: GraphQLID },
    Key: { type: GraphQLString },
    Value: { type: GraphQLString },
    Timestamp: { type: GraphQLInt },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    ObjectId: { type: GraphQLString },
    Attributes: {
      type: new GraphQLList(AttributeType),
      args: { Timestamp: { type: GraphQLInt } },
      resolve(parent, args) {
        return Attribute.find({
          objectId: parent.ObjectId,
          // $lte
          Timestamp: { $lte: args.Timestamp }
        })
          .sort({ Timestamp: -1 })
          .limit(1);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    attribute: {
      type: AttributeType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Attribute.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
      }
    },
    attributes: {
      type: new GraphQLList(AttributeType),
      resolve(parent, args) {
        return Attribute.find({});
      }
    },
    historicals: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addHistorical: {
      type: AuthorType,
      args: {
        ObjectId: { type: GraphQLString }
      },
      resolve(parent, args) {
        let author = new Author({
          ObjectId: args.ObjectId
        });
        return author.save();
      }
    },
    addAttribute: {
      type: AttributeType,
      args: {
        Key: { type: new GraphQLNonNull(GraphQLString) },
        Value: { type: new GraphQLNonNull(GraphQLString) },
        Timestamp: { type: GraphQLInt },
        objectId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let attribute = new Attribute({
          Key: args.Key,
          Value: args.Value,
          objectId: args.objectId,
          Timestamp: args.Timestamp
        });
        return attribute.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
