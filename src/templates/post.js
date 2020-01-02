import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Head from "../components/head";

import postStyles from "./post.module.scss";

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date(formatString: "MMMM Do, YYYY")
      }
      html
    }
  }
`

const Post = props => {
  return (
    <Layout>
      <Head title={props.data.markdownRemark.frontmatter.title} />
      <h2>{props.data.markdownRemark.frontmatter.title}</h2>
      <p className={postStyles.date}>{props.data.markdownRemark.frontmatter.date}</p>
      <div
        dangerouslySetInnerHTML={{ __html: props.data.markdownRemark.html }}
      ></div>
    </Layout>
  )
}

export default Post