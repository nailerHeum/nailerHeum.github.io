import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const Head = ({ title }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  return (<Helmet
    title={`${title} | ${data.site.siteMetadata.title}`}
    link={[
      {
        "rel": "icon",
        "type": "image/png",
        "href": "favicon.png",
      },
      {
        "rel": "alternate",
        "type": "application/rss+xml",
        "href": "/rss.xml",
      }
    ]}
  />);
}
export default Head