import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout"
import Head from "../components/head"

const AboutPage = () => {
  return (
    <Layout>
      <Head title="About" />
      <h1>최성흠</h1>
      <p>연락하고 싶다면? <Link to="/contact">여기로!!</Link></p>
    </Layout>
  )
}

export default AboutPage;
