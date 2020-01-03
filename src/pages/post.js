import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";

import Layout from "../components/layout";
import Head from "../components/head"

import postStyles from "./post.module.scss";

const PostPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark (
        sort:{
          fields: frontmatter___date
          order:DESC
        }
      ){
        edges {
          node {
            frontmatter {
              title
              date(formatString: "MMMM Do, YYYY")
            }
            fields {
              slug
            }
            excerpt
          }
        }
      }
    }
  `)
  return (
    <Layout>
      <Head title="Posts" />
      <h1>Posts</h1>
      <ol className={postStyles.posts}>
        {data.allMarkdownRemark.edges.map(edge => {
          return (
            <li key={edge.node.frontmatter.title} className={postStyles.post}>
              <Link to={`/post/${edge.node.fields.slug}`}>
                <h3>{edge.node.frontmatter.title}</h3>
                <p>{edge.node.frontmatter.date}</p>
                <p>{edge.node.excerpt + "more"}</p>
              </Link>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default PostPage;
